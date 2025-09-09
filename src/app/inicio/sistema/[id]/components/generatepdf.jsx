import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable';

export const generatePDF = (data) => {
    // Extraemos los datos para facilitar su uso
    const { cotizacion, productos, condiciones_generales, descuento } = data;

    // Inicializar el documento PDF
    const doc = new jsPDF();

    // --- CÓDIGO DEL ENCABEZADO Y TABLA DE PRODUCTOS (SIN CAMBIOS) ---
    doc.setFontSize(10);
    doc.text("Nombre de tu Empresa S.A. de C.V.", 14, 20);
    doc.text("Calle Ficticia 123, Colonia Centro", 14, 25);
    doc.text("Tonalá, Jalisco, México. C.P. 45400", 14, 30);
    const date = new Date();
    const formattedDate = date.toLocaleDateString('es-MX', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
    const clientDataBody = [
        [{ content: 'FECHA:', styles: { fontStyle: 'bold' } }, { content: formattedDate, colSpan: 3, styles: { textColor: '#c00000' } }, { content: 'No. De Cotizacion:', styles: { fontStyle: 'bold' } }, { content: cotizacion.id, colSpan: 1 }],
        [{ content: 'CLIENTE:', styles: { fontStyle: 'bold' } }, { content: cotizacion.cliente_nombre, colSpan: 5, styles: { textColor: '#c00000' } }],
        [{ content: 'Telefono:', styles: { fontStyle: 'bold' } }, { content: cotizacion.cliente_telefono, colSpan: 2, styles: { textColor: '#c00000' } }, { content: 'Linea Cotizada:', styles: { fontStyle: 'bold' } }, { content: cotizacion.linea_cotizada || 'Motores', colSpan: 2, styles: { textColor: '#c00000' } }],
        [{ content: 'Mail:', styles: { fontStyle: 'bold' } }, { content: cotizacion.cliente_email || '', colSpan: 2 }, { content: 'Nombre Proyecto:', styles: { fontStyle: 'bold' } }, { content: cotizacion.nombre_proyecto || 'Mitikah', colSpan: 2, styles: { textColor: '#c00000' } }],
        [{ content: 'Direccion:', styles: { fontStyle: 'bold' } }, { content: cotizacion.cliente_domicilio, colSpan: 5, styles: { textColor: '#c00000' } }],
        [{ content: 'Ciudad:', styles: { fontStyle: 'bold' } }, { content: cotizacion.cliente_ciudad, styles: { textColor: '#c00000' } }, { content: 'Estado:', styles: { fontStyle: 'bold' } }, { content: cotizacion.cliente_estado, styles: { textColor: '#c00000' } }, { content: 'CP:', styles: { fontStyle: 'bold' } }, { content: cotizacion.codigo_postal, styles: { textColor: '#c00000' } }]
    ];
    autoTable(doc, {
        body: clientDataBody,
        startY: 45, theme: 'grid',
        styles: { cellPadding: 1.5, fontSize: 9, valign: 'middle', lineWidth: 0.1, lineColor: [180, 180, 180] }
    });
    const tableColumn = ["SKU", "Medida", "Descripción/Gama", "P. Unitario", "Cantidad", "Total"];
    const tableRows = productos.map(item => [
        item.sku, item.medida, item.descripcion,
        `$${Number(item.preciounico || 0).toFixed(2)}`,
        item.cantidad, `$${Number(item.preciototal || 0).toFixed(2)}`,
    ]);
    autoTable(doc, {
        head: [tableColumn], body: tableRows,
        startY: doc.lastAutoTable.finalY + 10, theme: 'grid',
        headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold' },
        styles: { fontSize: 8, cellPadding: 2 },
    });
    const formatCurrency = (value) => `$ ${Number(value || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    const startY = doc.lastAutoTable.finalY + 3;
    const subTotal = parseFloat(cotizacion.precioNormal);
    const discountAmount = subTotal - parseFloat(cotizacion.precioNormalconDescuento);
    const total = parseFloat(cotizacion.precioReal);
    const footerBody = [
        [{ content: `${descuento.titulo}\n${descuento.comentario}`, rowSpan: 3, styles: { valign: 'top', fontStyle: 'bold', textColor: [192, 0, 0] } }, { content: 'Sub Total', styles: { halign: 'right' } }, { content: formatCurrency(subTotal), styles: { halign: 'right' } }],
        [{ content: 'Descuento', styles: { halign: 'right' } }, { content: formatCurrency(discountAmount), styles: { halign: 'right' } }],
        [{ content: '*Total', styles: { halign: 'right', fontStyle: 'bold' } }, { content: formatCurrency(total), styles: { halign: 'right', fontStyle: 'bold' } }],
        [{ content: '*Precio Valido solo en Paquete, no aplica en partidas separadas\n*Precio mas Iva en caso de requerir factura', styles: { valign: 'top', fontSize: 8, textColor: [100, 100, 100] } }, { content: 'Monto pendiente de Liquidar', styles: { fontStyle: 'bold', halign: 'right', fillColor: [220, 220, 220] } }, { content: formatCurrency(total), styles: { fontStyle: 'bold', halign: 'right', fillColor: [220, 220, 220] } }]
    ];
    autoTable(doc, {
        startY: startY,
        body: footerBody,
        theme: 'grid',
        styles: { fontSize: 9, lineWidth: 0.1, lineColor: [150, 150, 150] },
        columnStyles: { 0: { cellWidth: 115 }, 1: { cellWidth: 30 }, 2: { cellWidth: 'auto' } }
    });

    // --- SECCIÓN DE CONDICIONES GENERALES CORREGIDA ---

    // 1. Dibuja el título manualmente fuera de la tabla
    const conditionsTitleY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.text('Condiciones Generales de Venta', 14, conditionsTitleY);

    // Prepara el cuerpo de la tabla (solo números y texto)
    const conditionsBody = condiciones_generales.map((cond, index) => {
        return [`${index + 1})`, cond.texto_condicion];
    });

    autoTable(doc, {
        // 2. Se elimina la opción 'head' de la tabla
        body: conditionsBody,
        // 3. Se ajusta la posición inicial 'startY' para que quede debajo del título manual
        startY: conditionsTitleY + 4,
        theme: 'plain',
        styles: { fontSize: 8 },
        columnStyles: {
            0: { cellWidth: 6 }, // Ancho para los números
            1: { cellWidth: 'auto' }  // El texto usa el espacio restante
        }
    });

    // --- PIE DE PÁGINA FINAL CON BARRA ROJA ---
    const pageCount = doc.internal.getNumberOfPages();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;

    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(`Página ${i} de ${pageCount}`, pageWidth - 14, pageHeight - 12);
        doc.setFillColor(192, 0, 0);
        doc.rect(0, pageHeight - 10, pageWidth, 10, 'F');
        doc.setFontSize(12);
        doc.setTextColor(255, 255, 255);
        doc.text('https://smartblinds.mx/', pageWidth / 2, pageHeight - 4, { align: 'center' });
    }

    doc.save(`cotizacion_${cotizacion.id}.pdf`);
};