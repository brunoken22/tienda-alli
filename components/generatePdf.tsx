import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from '@react-pdf/renderer';
import {TypeCompra} from '@/lib/atom';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 10,
  },
  logo: {
    width: 50,
    height: 50,
    marginLeft: 20,
    marginRight: 120,
    borderRadius: '50%',
  },
  headerTextContainer: {
    marginLeft: 10, // Espaciado entre el logo y el texto
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  borderSeparation: {
    height: 1,
    backgroundColor: '#444444',
    width: 0.8 * 700,
    margin: 'auto',
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  sectionText: {
    fontSize: 12,
  },
  table: {
    display: 'flex',
    width: '100%',
    borderStyle: 'solid',
    borderColor: '#b2b2b2',
    borderWidth: 1,
    marginTop: 15,
  },
  image: {
    width: 50,
    height: 55,
    objectFit: 'cover',
    flex: 1,
    padding: 8,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomColor: '#b2b2b2',
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  tableCell: {
    flex: 1,
    padding: 8,
    fontSize: 12,
    textAlign: 'center',
  },
  totalRow: {
    flexDirection: 'row',
    padding: 30,
    backgroundColor: '#edff9e',
  },
  totalLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'right',
  },
});

export function GeneratePdf({data}: {data: TypeCompra[]}) {
  const fecha = obtenerFechaDelMes();

  return (
    <Document>
      <Page size='A4' style={styles.page}>
        <View style={styles.header}>
          <Image src={'/tienda-alli.png'} style={styles.logo} />
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerText}>Factura de Compra Tienda Alli</Text>
          </View>
        </View>
        <View style={styles.borderSeparation}></View>
        <View style={styles.section}>
          <Text style={styles.sectionText}>Fecha: {fecha}</Text>
          <Text style={styles.sectionText}>Whatsaap: 1161204047</Text>

          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Imagen</Text>
              <Text style={styles.tableCell}>Producto</Text>
              <Text style={styles.tableCell}>Cantidad</Text>
              <Text style={styles.tableCell}>Precio Unitario</Text>
              <Text style={styles.tableCell}>Total</Text>
            </View>

            {data.map((producto) => (
              <View style={styles.tableRow} key={producto.id}>
                <Image src={producto.img} style={styles.image}></Image>
                <Text style={styles.tableCell}>{producto.title}</Text>
                <Text style={styles.tableCell}>{producto.cantidad}</Text>
                <Text style={styles.tableCell}>{`$${producto.price.toFixed(
                  2
                )}`}</Text>
                <Text style={styles.tableCell}>{`$${(
                  producto.cantidad * producto.price
                ).toFixed(2)}`}</Text>
              </View>
            ))}
          </View>

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalValue}>
              {data.length &&
                data
                  .reduce(
                    (acumulador: any, objeto: any) =>
                      acumulador + objeto.price * (objeto.cantidad || 1),
                    0
                  )
                  .toLocaleString('es-AR', {
                    style: 'currency',
                    currency: 'ARS',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}

const obtenerFechaDelMes = () => {
  const fechaActual = new Date();

  // Obtener el día del mes
  const dia = fechaActual.getDate();

  // Obtener el mes (0-11, donde 0 es enero y 11 es diciembre)
  const mes = fechaActual.getMonth() + 1; // Sumamos 1 ya que los meses van de 0 a 11

  // Obtener el año
  const año = fechaActual.getFullYear();

  // Construir la cadena de fecha en el formato deseado (DD/MM/YYYY)
  const fechaFormateada = `${dia < 10 ? '0' : ''}${dia}/${
    mes < 10 ? '0' : ''
  }${mes}/${año}`;

  return fechaFormateada;
};
