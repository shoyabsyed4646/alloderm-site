const fs = require('fs');
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');

const COL_HEIGHT = 30;
const COLUMN_WIDTHS = [50, 80, 300];
const MAX_PER_PAGE = 18;
const COLOR_LIGHT_GRAY = rgb(0.960, 0.960, 0.960);
const COLOR_BLACK = rgb(0, 0, 0);
const COLOR_WHITE = rgb(1, 1, 1);
const FONT_SIZE = 15;

const statusCode = {
	success: 200,
	emptySuccess: 204,
	error: 500,
	methodNotSupported: 405,
	missingData: 422
};

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

	const { _answers: { OrderDetails } } = data;
	const contents = await fs.readFileSync(require.resolve('./PDF-Template.pdf'));
  const loadedPdf = await PDFDocument.load(contents);
  const pdfDoc = await PDFDocument.create();
	const font = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const fontBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
	const [loadedPdfFirstPage, loadedPdfSecondPage] = await pdfDoc.copyPages(loadedPdf, [0, 1]);
	const table = [];

	OrderDetails.map((product, idx) => {
		table.push({
			id: `row-${idx}`,
			page: idx < MAX_PER_PAGE ? 0 : 1,
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
		});
	});

	// If only 18 results, need to show page with footer, 2nd page in template.
	if (OrderDetails.length <= MAX_PER_PAGE) {
		pdfDoc.addPage(loadedPdfSecondPage);
	} else {
		pdfDoc.addPage(loadedPdfFirstPage);
		pdfDoc.addPage(loadedPdfSecondPage);		
	}

	// const pages = pdfDoc.getPages();

	// pages.forEach((page, pageIdx) => {
	// 	const { height } = page.getSize();
	// 	const startYPos = pageIdx === 1 ? height - 1200 : height - 800;

	// 	table.forEach((row, rowIdx) => {
	// 		if (row.page === pageIdx) {
	// 			row.columns.forEach((col, colIdx) => {
	// 				const colWidth = COLUMN_WIDTHS[colIdx];
	// 				let xPos = COL_HEIGHT;

	// 				if (colIdx === 1) {
	// 					xPos += COLUMN_WIDTHS[0]
	// 				}

	// 				if (colIdx === 2) {
	// 					xPos += COLUMN_WIDTHS[0] + COLUMN_WIDTHS[1];
	// 				}

	// 				page.drawRectangle({
	// 					width: colWidth,
	// 					height: COL_HEIGHT,
	// 					borderWidth: 1,
	// 					borderColor: COLOR_BLACK,
	// 					color: COLOR_WHITE, 
	// 					x: xPos,
	// 					y: height - (startYPos + (COL_HEIGHT * rowIdx)),
	// 				});

	// 				page.drawText(`${col.value}, ${rowIdx}.${colIdx}`, {
	// 					x: xPos + 10,
	// 					y: height - (startYPos + (COL_HEIGHT * rowIdx)) + 15,
	// 					size: FONT_SIZE,
	// 					font: colIdx === 1 ? fontBold : font,
	// 					color: COLOR_BLACK,
	// 				})
	// 			})
	// 		}
	// 	})
	// });

	const pdfBytes = await pdfDoc.save();
	
  callback(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/pdf",
			'Access-Control-Allow-Methods': 'POST'
    },
    isBase64Encoded: true,
    statusCode: statusCode.success,
    body: Buffer.from(pdfBytes).toString('base64'),
  });
};  