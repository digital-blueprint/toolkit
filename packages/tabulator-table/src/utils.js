export async function generatePDFDownload(tabulatorTable, data, dataName) {
    // Get only displayed columns. [respect Column setting modal state]
    let columns = tabulatorTable.getColumns();
    let header = [];
    for (let column of columns) {
        let definition = column.getDefinition();
        if (!column.isVisible()) {
            continue;
        }
        let field = column.getField();
        if (field !== 'empty' && field !== 'undefined' && definition.formatter !== 'html')
            header.push(column.getField());
    }

    let body = [];
    for (let entry of data) {
        let entry_array = [];
        header.forEach((column) => {
            let cellValue = entry[column] ? entry[column] : '-';
            if (Array.isArray(cellValue)) {
                cellValue = cellValue.join(', ');
            }
            entry_array.push(cellValue);
        });
        body.push(entry_array);
    }

    let jsPDF = (await import('jspdf')).default;
    let autoTable = (await import('jspdf-autotable')).default;
    const doc = new jsPDF('l', 'pt');
    autoTable(doc, {
        head: [header],
        body: body,
        horizontalPageBreak: false,
        tableWidth: 'auto',
        styles: {
            overflow: 'linebreak',
            valign: 'middle',
            cellWidth: 'auto',
        },
        headStyles: {
            // cellWidth: 'auto'
        },
        bodyStyles: {
            // cellWidth: 'auto',
            overflow: 'linebreak',
        },
    });
    doc.save(dataName + '.pdf');
}

export async function downloadExcel(rows, dataName) {
    let entries = [];
    for (let row of rows) {
        let cells = row.getCells();
        let entry = {};
        for (let cell of cells) {
            let column = cell.getColumn();
            let definition = column.getDefinition();
            if (definition.visible === false) {
                continue;
            }
            let field = cell.getField();
            let title = null;
            if (field !== 'empty' && field !== 'undefined' && definition.formatter !== 'html') {
                if ('titleFormatter' in definition && typeof definition.titleFormatter === 'function') {
                    title = definition.titleFormatter(
                        {
                            getValue() {
                                return field;
                            }
                        },
                        definition['titleFormatterParams'] || {},
                        null
                    );
                }
                let cellValue = cell.getValue();
                if ('formatter' in definition && typeof definition.formatter === 'function') {
                    cellValue = definition.formatter(
                        {
                            getValue() {
                                return cellValue;
                            }
                        },
                        definition['formatterParams'] || {},
                        null
                    );
                }
                const headerLabel = title || definition.title || field;
                entry[headerLabel] = cellValue;
            }
        }
        entries.push(entry);
    }

    const ExcelJS = (await import('exceljs')).default;
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(dataName);

    if (entries.length > 0) {
        const headers = Object.keys(entries[0]);
        worksheet.addRow(headers);
        entries.forEach((entry) => {
            const rowData = headers.map((header) => entry[header] || '');
            worksheet.addRow(rowData);
        });
    }

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = dataName + '.xlsx';
    link.click();
    URL.revokeObjectURL(url);
}
