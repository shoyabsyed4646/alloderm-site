import { PDFDocument, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';

const COL_HEIGHT = 27;
const COLUMN_WIDTHS = [40, 85, 365];
const MAX_PER_PAGE = 18;
const COLOR_TEXT = rgb(0, 0, 0);
const COLOR_CELL = rgb(1, 1, 1);
const COLOR_BORDER = rgb(0.494, 0.494, 0.494);
const FONT_SIZE = 15.5;

function* chunks(arr, n) {
    for (let i = 0; i < arr.length; i += n) {
        yield arr.slice(i, i + n);
    }
}

function organizeData(arr) {
    return chunks(arr.map((product, idx) => ({ 
        id: `row-${idx}`,
        columns: [
            {
                id: `row-${idx}-col-0`,
                value: String(product.Quantity),
            },
            {
                id: `row-${idx}-col-1`,
                value: product.ItemCode,
            },
            {
                id: `row-${idx}-col-2`,
                value: product.OrderDescription,
            }
        ]
    })), MAX_PER_PAGE);
}

const fetchAsset = async (path, requestUrl) => {
    const assetUrl = new URL(path, requestUrl);
    const response = await fetch(assetUrl);
    if (!response.ok) {
        throw new Error(`Failed to fetch asset: ${path} (${response.statusText})`);
    }
    return response.arrayBuffer();
};

export async function onRequest(context) {
    const { request } = context;

    if (request.method !== "POST") {
        return new Response("Method Not Allowed", { status: 405 });
    }

    let data;
    try {
        data = await request.json();
    } catch (err) {
        return new Response("Invalid request body (Expected JSON)", { status: 400 });
    }

    if (!data._answers || !data._answers.OrderDetails) {
        return new Response('Missing data (Expected data._answers.OrderDetails)', { status: 422 });
    }

    const { _answers: { OrderDetails } } = data;
    const totalProducts = OrderDetails.length;
    const pagesData = [...organizeData(OrderDetails)];
    
    try {
        const [myriadProRegular, myriadProBold, contents] = await Promise.all([
            fetchAsset('/fonts/MyriadPro-Regular.ttf', request.url), 
            fetchAsset('/fonts/MyriadPro-Bold.ttf', request.url), 
            fetchAsset('/PDF-Template.pdf', request.url), 
        ]);

        const loadedPdf = await PDFDocument.load(contents);
        const pdfDoc = await PDFDocument.create();

        pdfDoc.registerFontkit(fontkit);

        const font = await pdfDoc.embedFont(myriadProRegular); 
        const fontBold = await pdfDoc.embedFont(myriadProBold); 
        
        const [loadedPdfFirstPage, loadedPdfSecondPage] = await pdfDoc.copyPages(loadedPdf, [0, 1]); 
        
        if (totalProducts <= MAX_PER_PAGE) {
            pdfDoc.addPage(loadedPdfSecondPage);
        } else {
            pdfDoc.addPage(loadedPdfFirstPage);
            pdfDoc.addPage(loadedPdfSecondPage); 
        }
        
        const pages = pdfDoc.getPages();

        pages.forEach((page, pageIdx) => {
            const { height } = page.getSize();
            let pageRows = pagesData[pageIdx];
            
            // Adjusted start position to align with a typical template header
            const TABLE_START_Y = height - 200; 

            if (!pageRows) return;

            pageRows.forEach((row, rowIdx) => {
                let xPos = 60;
                
                // Calculate the current row's bottom Y coordinate
                const currentRowY = TABLE_START_Y - (COL_HEIGHT * rowIdx);

                row.columns.forEach((col, colIdx) => {
                    const colWidth = COLUMN_WIDTHS[colIdx];
                    
                    if (colIdx === 1) {
                        xPos = 60 + COLUMN_WIDTHS[0];
                    } else if (colIdx === 2) {
                        xPos = 60 + COLUMN_WIDTHS[0] + COLUMN_WIDTHS[1];
                    } else {
                        xPos = 60;
                    }

                    // Draw Rectangle: Y is the bottom edge
                    page.drawRectangle({
                        width: colWidth,
                        height: COL_HEIGHT,
                        borderWidth: 1,
                        borderColor: COLOR_BORDER,
                        color: COLOR_CELL, 
                        x: xPos,
                        y: currentRowY - COL_HEIGHT, 
                    });

                    // Draw Text: Y is the text baseline
                    page.drawText(col.value, {
                        x: xPos + 6,
                        y: currentRowY - COL_HEIGHT + 8,
                        size: FONT_SIZE,
                        font: colIdx === 1 ? fontBold : font,
                        color: COLOR_TEXT,
                    });
                });
            });
        });

        const pdfBytes = await pdfDoc.save();

        return new Response(pdfBytes, {
            status: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/pdf",
                'Access-Control-Allow-Methods': 'POST',
                "Content-Disposition": "attachment; filename=\"Quiz_Results.pdf\"", 
            },
        });

    } catch (error) {
        console.error("PDF Generation Error:", error.message);
        return new Response(`PDF generation failed: ${error.message}`, { status: 500 });
    }
}