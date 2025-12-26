import { ShoppingCart } from "@/types/shopping-cart";
import { Document, Page, Text, View, Image, StyleSheet, Font } from "@react-pdf/renderer";

// Registrar fuentes (opcional pero recomendado)
Font.register({
  family: "Open Sans",
  fonts: [
    { src: "https://fonts.gstatic.com/s/opensans/v18/mem8YaGs126MiZpBA-UFVZ0e.ttf" },
    {
      src: "https://fonts.gstatic.com/s/opensans/v18/mem5YaGs126MiZpBA-UNirkOUuhs.ttf",
      fontWeight: 600,
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 30,
    fontFamily: "Open Sans",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  headerTextContainer: {},
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 12,
    color: "#7f8c8d",
  },
  invoiceInfo: {
    textAlign: "right",
  },
  invoiceNumber: {
    fontSize: 12,
    color: "#7f8c8d",
    marginBottom: 5,
  },
  invoiceDate: {
    fontSize: 12,
    color: "#7f8c8d",
  },
  divider: {
    height: 2,
    backgroundColor: "#3498db",
    marginVertical: 20,
    width: "100%",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ecf0f1",
    paddingBottom: 5,
  },
  sectionText: {
    fontSize: 12,
    color: "#34495e",
    marginBottom: 5,
  },
  table: {
    width: "100%",
    marginTop: 15,
    borderWidth: 1,
    borderColor: "#ecf0f1",
    borderRadius: 5,
    overflow: "hidden",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#3498db",
    color: "#FFFFFF",
    paddingVertical: 8,
  },
  tableHeaderCell: {
    flex: 1,
    fontSize: 12,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ecf0f1",
    alignItems: "center",
    paddingVertical: 10,
  },
  tableRowEven: {
    backgroundColor: "#f8f9fa",
  },
  tableCell: {
    flex: 1,
    fontSize: 10,
    color: "#34495e",
    textAlign: "center",
    paddingHorizontal: 5,
  },
  productImage: {
    width: 40,
    height: 40,
    objectFit: "cover",
    borderRadius: 3,
  },
  productNameCell: {
    flex: 2,
    textAlign: "left",
    paddingLeft: 10,
  },
  totalSection: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#f8f9fa",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ecf0f1",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  totalLabel: {
    fontSize: 12,
    color: "#7f8c8d",
  },
  totalValue: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  grandTotal: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#e74c3c",
  },
  footer: {
    marginTop: 30,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#ecf0f1",
    fontSize: 10,
    color: "#7f8c8d",
    textAlign: "center",
  },
});

const formatDate = (): string => {
  const date = new Date();
  return date.toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const formatCurrency = (value: number): string => {
  return value.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};

export function GeneratePdf({ data }: { data: Omit<ShoppingCart, "variant">[] }) {
  const date = formatDate();
  const subtotal = data.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
  const taxRate = 0.0; // 21% q
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <Document>
        <Page size='A4'>
          <View style={styles.section}>
            <Text>No hay productos en el carrito</Text>
          </View>
        </Page>
      </Document>
    );
  }

  return (
    <Document>
      <Page size='A4' style={styles.page}>
        {/* Encabezado */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image src='/tienda-alli.png' style={styles.logo} />
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerTitle}>Tienda Allí</Text>
              <Text style={styles.headerSubtitle}>Ropa y accesorios de calidad</Text>
            </View>
          </View>

          <View style={styles.invoiceInfo}>
            <Text style={styles.invoiceDate}>Fecha: {date}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Información de contacto */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información de contacto</Text>
          <Text style={styles.sectionText}>WhatsApp: +54 11 5910-2865</Text>
          <Text style={styles.sectionText}>Email: gabriela.182230@gmail.com</Text>
        </View>

        {/* Tabla de productos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detalle de productos</Text>
          <View style={styles.table}>
            {/* Encabezados de la tabla */}
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCell, { flex: 0.5 }]}>#</Text>
              <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Imagen</Text>
              <Text style={[styles.tableHeaderCell, { flex: 2 }]}>Producto</Text>
              <Text style={styles.tableHeaderCell}>Cantidad</Text>
              <Text style={styles.tableHeaderCell}>P. Unitario</Text>
              <Text style={styles.tableHeaderCell}>Total</Text>
            </View>

            {/* Filas de productos */}
            {data.map((producto, index) => (
              <View
                style={[styles.tableRow, index % 2 === 0 ? {} : styles.tableRowEven]}
                key={producto.id}
              >
                <Text style={[styles.tableCell, { flex: 0.5 }]}>{index + 1}</Text>
                <Image
                  src={producto.images[0] || "/tienda-alli-webp"}
                  style={[styles.tableCell, styles.productImage]}
                />
                <Text style={[styles.tableCell, styles.productNameCell]}>
                  {producto.title}
                  {producto.variantSize && ` - Talle ${producto.variantSize}`}
                </Text>
                <Text style={styles.tableCell}>{producto.quantity}</Text>
                <Text style={styles.tableCell}>{formatCurrency(producto.price)}</Text>
                <Text style={styles.tableCell}>
                  {formatCurrency(producto.quantity * producto.price)}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Totales */}
        <View style={styles.totalSection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal:</Text>
            <Text style={styles.totalValue}>{formatCurrency(subtotal)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>IVA (0%):</Text>
            <Text style={styles.totalValue}>{formatCurrency(tax)}</Text>
          </View>
          <View style={[styles.totalRow, { marginTop: 10 }]}>
            <Text style={[styles.totalLabel, { fontWeight: "bold" }]}>Total:</Text>
            <Text style={[styles.totalValue, styles.grandTotal]}>{formatCurrency(total)}</Text>
          </View>
        </View>

        {/* Pie de página */}
        <View style={styles.footer}>
          <Text>Gracias por su compra en Tienda Allí</Text>
          {/* <Text>Para consultas o devoluciones, contactarnos dentro de las 48hs</Text> */}
        </View>
      </Page>
    </Document>
  );
}
