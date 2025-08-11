import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  TextInput,
  RefreshControl,
} from 'react-native';
import AdminLayout from '@/components/AdminLayout';
import fumigacionData from '@/data/fumigacionData.json';
import clientData from '@/data/fumigacionPorCliente.json';

const { width } = Dimensions.get('window');

interface FumigationData {
  Mes: string;
  Exportado: number;
  Presupuestado: number;
  Fumigado: number;
}

interface ClientData {
  Exportadora: string;
  Sucursal: string;
  Socio: string;
  Enero: number;
  Febrero: number;
  Marzo: number;
  Abril: number;
  Mayo: number;
  Junio: number;
  Total: number;
  Participacion: string;
}

export default function DashboardScreen() {
  const [selectedMonth, setSelectedMonth] = useState("Todos");
  const [clientFilter, setClientFilter] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const months = ["Todos", "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio"];

  const filtered = useMemo(() => {
    return selectedMonth === "Todos"
      ? fumigacionData
      : fumigacionData.filter((d: FumigationData) => d.Mes === selectedMonth);
  }, [selectedMonth]);

  const filteredClients = useMemo(() => {
    return clientData.filter((c: ClientData) =>
      c.Exportadora.toLowerCase().includes(clientFilter.toLowerCase())
    );
  }, [clientFilter]);

  const totalExport = filtered.reduce((sum, d) => sum + d.Exportado, 0);
  const totalFumig = filtered.reduce((sum, d) => sum + d.Fumigado, 0);
  const totalPres = filtered.reduce((sum, d) => sum + d.Presupuestado, 0);
  const porcentaje = totalExport > 0 ? ((totalFumig / totalExport) * 100).toFixed(1) + "%" : "0%";

  const onRefresh = () => {
    setRefreshing(true);
    // Simular refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const renderSummaryCard = (title: string, value: string | number, color: string = '#10b981') => (
    <View style={[styles.summaryCard, { borderLeftColor: color }]}>
      <Text style={styles.summaryCardTitle}>{title}</Text>
      <Text style={[styles.summaryCardValue, { color }]}>{value}</Text>
    </View>
  );

  const renderMonthSelector = () => (
    <View style={styles.monthSelectorContainer}>
      <Text style={styles.sectionTitle}>Filtrar por mes:</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.monthSelector}>
        {months.map((month) => (
          <TouchableOpacity
            key={month}
            style={[
              styles.monthButton,
              selectedMonth === month && styles.monthButtonActive
            ]}
            onPress={() => setSelectedMonth(month)}
          >
            <Text style={[
              styles.monthButtonText,
              selectedMonth === month && styles.monthButtonTextActive
            ]}>
              {month}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderChart = () => (
    <View style={styles.chartContainer}>
      <Text style={styles.sectionTitle}>Datos Mensuales</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.chart}>
          {filtered.map((data, index) => {
            const maxValue = Math.max(...filtered.map(d => Math.max(d.Exportado, d.Fumigado, d.Presupuestado)));
            const exportHeight = (data.Exportado / maxValue) * 120;
            const fumigHeight = (data.Fumigado / maxValue) * 120;
            const presHeight = (data.Presupuestado / maxValue) * 120;

            return (
              <View key={index} style={styles.chartBar}>
                <View style={styles.chartBarsContainer}>
                  <View style={[styles.bar, styles.exportBar, { height: exportHeight }]} />
                  <View style={[styles.bar, styles.fumigBar, { height: fumigHeight }]} />
                  <View style={[styles.bar, styles.presBar, { height: presHeight }]} />
                </View>
                <Text style={styles.chartLabel}>{data.Mes.substring(0, 3)}</Text>
              </View>
            );
          })}
        </View>
      </ScrollView>
      
      <View style={styles.chartLegend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, styles.exportBar]} />
          <Text style={styles.legendText}>TM Exportado</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, styles.fumigBar]} />
          <Text style={styles.legendText}>TM Fumigado</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, styles.presBar]} />
          <Text style={styles.legendText}>TM Presupuestado</Text>
        </View>
      </View>
    </View>
  );

  const renderClientTable = () => (
    <View style={styles.tableContainer}>
      <Text style={styles.sectionTitle}>Fumigación por Cliente</Text>
      
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar exportadora..."
        value={clientFilter}
        onChangeText={setClientFilter}
      />

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.table}>
          {/* Header */}
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.tableHeader, { width: 180 }]}>Exportadora</Text>
            <Text style={[styles.tableCell, styles.tableHeader, { width: 80 }]}>Sucursal</Text>
            <Text style={[styles.tableCell, styles.tableHeader, { width: 60 }]}>Socio</Text>
            <Text style={[styles.tableCell, styles.tableHeader, { width: 60 }]}>Ene</Text>
            <Text style={[styles.tableCell, styles.tableHeader, { width: 60 }]}>Feb</Text>
            <Text style={[styles.tableCell, styles.tableHeader, { width: 60 }]}>Mar</Text>
            <Text style={[styles.tableCell, styles.tableHeader, { width: 60 }]}>Abr</Text>
            <Text style={[styles.tableCell, styles.tableHeader, { width: 60 }]}>May</Text>
            <Text style={[styles.tableCell, styles.tableHeader, { width: 60 }]}>Jun</Text>
            <Text style={[styles.tableCell, styles.tableHeader, { width: 80 }]}>Total</Text>
            <Text style={[styles.tableCell, styles.tableHeader, { width: 80 }]}>% Participación</Text>
          </View>

          {/* Data */}
          {filteredClients.slice(0, 10).map((client, index) => (
            <View key={index} style={[styles.tableRow, index % 2 === 0 && styles.tableRowEven]}>
              <Text style={[styles.tableCell, { width: 180 }]} numberOfLines={2}>
                {client.Exportadora}
              </Text>
              <Text style={[styles.tableCell, { width: 80 }]}>
                {client.Sucursal || '-'}
              </Text>
              <Text style={[styles.tableCell, { width: 60 }]}>
                {client.Socio}
              </Text>
              <Text style={[styles.tableCell, { width: 60 }]}>
                {client.Enero.toFixed(0)}
              </Text>
              <Text style={[styles.tableCell, { width: 60 }]}>
                {client.Febrero.toFixed(0)}
              </Text>
              <Text style={[styles.tableCell, { width: 60 }]}>
                {client.Marzo.toFixed(0)}
              </Text>
              <Text style={[styles.tableCell, { width: 60 }]}>
                {client.Abril.toFixed(0)}
              </Text>
              <Text style={[styles.tableCell, { width: 60 }]}>
                {client.Mayo.toFixed(0)}
              </Text>
              <Text style={[styles.tableCell, { width: 60 }]}>
                {client.Junio.toFixed(0)}
              </Text>
              <Text style={[styles.tableCell, styles.tableCellBold, { width: 80 }]}>
                {client.Total.toFixed(0)}
              </Text>
              <Text style={[styles.tableCell, styles.tableCellGreen, { width: 80 }]}>
                {client.Participacion}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {filteredClients.length > 10 && (
        <Text style={styles.tableFooter}>
          Mostrando top 10 de {filteredClients.length} exportadoras
        </Text>
      )}
    </View>
  );

  return (
    <AdminLayout title="Dashboard de Fumigación 2023">
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Month Selector */}
        {renderMonthSelector()}

        {/* Summary Cards */}
        <View style={styles.summaryContainer}>
          {renderSummaryCard("Total Exportado (TM)", totalExport.toLocaleString(), '#3b82f6')}
          {renderSummaryCard("Total Fumigado (TM)", totalFumig.toLocaleString(), '#10b981')}
          {renderSummaryCard("Total Presupuestado (TM)", totalPres.toLocaleString(), '#8b5cf6')}
          {renderSummaryCard("% Participación", porcentaje, '#f59e0b')}
        </View>

        {/* Chart */}
        {renderChart()}

        {/* Client Table */}
        {renderClientTable()}
      </ScrollView>
    </AdminLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  monthSelectorContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  monthSelector: {
    marginBottom: 8,
  },
  monthButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    backgroundColor: '#f3f4f6',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  monthButtonActive: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  monthButtonText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  monthButtonTextActive: {
    color: '#ffffff',
  },
  summaryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  summaryCard: {
    width: (width - 48) / 2,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  summaryCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 8,
  },
  summaryCardValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  chartContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 140,
    paddingHorizontal: 16,
  },
  chartBar: {
    alignItems: 'center',
    marginRight: 20,
  },
  chartBarsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 120,
    marginBottom: 8,
  },
  bar: {
    width: 12,
    marginHorizontal: 1,
    borderRadius: 2,
  },
  exportBar: {
    backgroundColor: '#3b82f6',
  },
  fumigBar: {
    backgroundColor: '#10b981',
  },
  presBar: {
    backgroundColor: '#8b5cf6',
  },
  chartLabel: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  chartLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginTop: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
    marginVertical: 4,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 2,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: '#6b7280',
  },
  tableContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  searchInput: {
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#d1d5db',
    fontSize: 14,
  },
  table: {
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  tableRowEven: {
    backgroundColor: '#f9fafb',
  },
  tableCell: {
    padding: 12,
    fontSize: 12,
    color: '#374151',
    textAlign: 'left',
  },
  tableHeader: {
    backgroundColor: '#f3f4f6',
    fontWeight: '600',
    color: '#1f2937',
  },
  tableCellBold: {
    fontWeight: '600',
  },
  tableCellGreen: {
    color: '#059669',
    fontWeight: '600',
  },
  tableFooter: {
    textAlign: 'center',
    marginTop: 12,
    fontSize: 12,
    color: '#6b7280',
    fontStyle: 'italic',
  },
});