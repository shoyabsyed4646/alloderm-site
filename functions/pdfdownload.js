const fs = require('fs');

const { PDFDocument, rgb, encodeToBase64 } = require('pdf-lib');
const fontkit = require('@pdf-lib/fontkit');

const COL_HEIGHT = 27;
const COLUMN_WIDTHS = [40, 85, 365];
const MAX_PER_PAGE = 18;
const COLOR_TEXT = rgb(0, 0, 0);
const COLOR_CELL = rgb(1, 1, 1);
const COLOR_BORDER = rgb(0.494, 0.494, 0.494);
const FONT_SIZE = 15.5;

const statusCode = {
	success: 200,
	emptySuccess: 204,
	error: 500,
	methodNotSupported: 405,
	missingData: 422
};

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
				value: product.Quantity,
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

exports.handler = async function (event, context, callback) {
	let data;

	if (event.httpMethod !== "POST") {
		return {
			statusCode: statusCode.methodNotSupported,
			body: "Method Not Allowed"
		};
	}
	try {
    data = JSON.parse(event.body);
  } catch (err) {
    data = event.queryStringParameters;
  }

	if (!data._answers || !data._answers.OrderDetails) {
		return {
			statusCode: statusCode.missingData,
			body: 'Missing data'
		};
	}

	const { _answers: { OrderDetails } } = data;
	const totalProducts = OrderDetails.length;
	const pagesData = [...organizeData(OrderDetails)];

	const myriadProRegular = await fs.readFileSync(require.resolve('./assets/MyriadPro-Regular.ttf'));
	const myriadProBold = await fs.readFileSync(require.resolve('./assets/MyriadPro-Bold.ttf'));
	const contents = await fs.readFileSync(require.resolve('./assets/PDF-Template.pdf'));

  const loadedPdf = await PDFDocument.load(contents);
  const pdfDoc = await PDFDocument.create();

	pdfDoc.registerFontkit(fontkit);

	const font = await pdfDoc.embedFont(myriadProRegular); 
  const fontBold = await pdfDoc.embedFont(myriadProBold); 
	const [loadedPdfFirstPage, loadedPdfSecondPage] = await pdfDoc.copyPages(loadedPdf, [0, 1]);	

	// If only 18 results, need to show page with footer, 2nd page in template.
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
		const startYPos = height - 600;

		pageRows.forEach((row, rowIdx) => {
			row.columns.forEach((col, colIdx) => {
				
				const colWidth = COLUMN_WIDTHS[colIdx];
				let xPos = 60;

				if (colIdx === 1) {
					xPos += COLUMN_WIDTHS[0]
				}

				if (colIdx === 2) {
					xPos += COLUMN_WIDTHS[0] + COLUMN_WIDTHS[1];
				}

				page.drawRectangle({
					width: colWidth,
					height: COL_HEIGHT,
					borderWidth: 1,
					borderColor: COLOR_BORDER,
					color: COLOR_CELL, 
					x: xPos,
					y: height - (startYPos + (COL_HEIGHT * rowIdx)),
				});

				page.drawText(col.value, {
					x: xPos + 6,
					y: height - (startYPos + (COL_HEIGHT * rowIdx)) + 8,
					size: FONT_SIZE,
					font: colIdx === 1 ? fontBold : font,
					color: COLOR_TEXT,
				})

				pageRows = null;
			})
		})
	});

	const pdfBytes = await pdfDoc.save();
	
  callback(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/pdf",
			'Access-Control-Allow-Methods': 'POST',
			"content-disposition": "attachment;filename=\"Quiz_Results.pdf\"",
    },
    isBase64Encoded: true,
    statusCode: statusCode.success,
    body: encodeToBase64(pdfBytes),
  });
};  