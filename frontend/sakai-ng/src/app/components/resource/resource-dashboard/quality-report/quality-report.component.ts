import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { ChartModule } from 'primeng/chart';
import { CardModule } from 'primeng/card';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { TooltipModule } from 'primeng/tooltip';
import { CalendarModule } from 'primeng/calendar';
import pluginDatalabels from 'chartjs-plugin-datalabels';
import { SplitButtonModule } from 'primeng/splitbutton';

import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-quality-report',
  standalone: true,
  imports: [CommonModule,CalendarModule,SplitButtonModule,
    TableModule,
    DropdownModule,
    ChartModule,
    CardModule, 
    FormsModule,
    ButtonModule,
    RippleModule,
    TooltipModule],
  templateUrl: './quality-report.component.html',
  styleUrl: './quality-report.component.scss'
})
export class QualityReportComponent {

  pluginDatalabels = pluginDatalabels;

  rangeDates: Date[] | undefined;
  filteredData = [];
  
  inspectQty : any;
  rejectionQty :any;
  rejectionPercentage :any;

  selectedLabel = 'Export';
  selectedIcon = 'pi pi-upload';

  items = [
    {
      label: 'Excel',
      icon: 'pi pi-file-excel',
      command: () => {
        this.selectedLabel = 'Excel';
        this.selectedIcon = 'pi pi-file-excel';
        this.exportToExcel();
      }
    },
    {
      label: 'PDF',
      icon: 'pi pi-file-pdf',
      command: () => {
        this.selectedLabel = 'PDF';
        this.selectedIcon = 'pi pi-file-pdf';
        this.exportToPDF();
      }
    }
  ];


  exportToExcel() {
    if (this.tableData.length === 0) {
      console.warn('No production data to export');
      return;
    }
  
    // Format data for Excel with proper date formatting
    const formattedData = this.tableData.map(record => ({
      'Date': this.formatDate(record.date),
      'Shift': record.shift,
      'Work Order': record.workOrder,
      'Customer': record.customer,
      'Part': record.part,
      'Actual Qty': record.actual,
      'Rejected Qty': record.reject,
      'Rejection %': (record.rejectionPercent * 100).toFixed(2),
      'Good Qty': (record.actual - record.reject),
      'Yield %': ((record.actual - record.reject) / record.actual * 100).toFixed(2),
      'Rejection Type': record.rejectionType
    }));
  
    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    
    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Production Quality Data');
    
    // Set column widths
    const wscols = [
      {wch: 10},  // Date
      {wch: 8},   // Shift
      {wch: 15},  // Work Order
      {wch: 20},  // Customer
      {wch: 30},  // Part
      {wch: 12},  // Actual Qty
      {wch: 12},  // Rejected Qty
      {wch: 12},  // Rejection %
      {wch: 12},  // Good Qty
      {wch: 12},  // Yield %
      {wch: 15}   // Rejection Type
    ];
    worksheet['!cols'] = wscols;
    
    // Generate Excel file with timestamp
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[-:T]/g, '');
    XLSX.writeFile(workbook, `Production_Quality_Data_${timestamp}.xlsx`);
  }
  
  exportToPDF() {
    if (this.tableData.length === 0) {
      console.warn('No production data to export');
      return;
    }
  
    try {
      // Create new PDF document (landscape to fit all columns)
      const doc = new jsPDF('l', 'mm', 'a4');
  
      // Add title
      doc.setFontSize(18);
      doc.setTextColor(40);
      doc.setFont('helvetica', 'bold');
      doc.text('Production Quality Report', 14, 20);
  
      // Add timestamp
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      const timestamp = new Date().toLocaleString();
      doc.text(`Generated on: ${timestamp}`, 14, 27);
  
      // Prepare data for PDF table
      const headers = [
        ['Date', 'Shift', 'Work Order', 'Customer', 'Part', 
         'Actual', 'Rejected', 'Rej%', 'Good', 'Yield%', 'Rejection Type']
      ];
  
      const data = this.tableData.map(record => [
        this.formatDate(record.date),
        record.shift,
        record.workOrder,
        record.customer,
        record.part,
        record.actual.toString(),
        record.reject.toString(),
        (record.rejectionPercent * 100).toFixed(2),
        (record.actual - record.reject).toString(),
        ((record.actual - record.reject) / record.actual * 100).toFixed(2),
        record.rejectionType
      ]);
  
      // Add table to PDF
      autoTable(doc,{
        head: headers,
        body: data,
        startY: 30,
        margin: { left: 14 },
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          fontStyle: 'bold',
          fontSize: 8
        },
        styles: {
          fontSize: 7,
          cellPadding: 2,
          overflow: 'linebreak',
          valign: 'middle'
        },
        columnStyles: {
          0: { cellWidth: 10 },  // Date
          1: { cellWidth: 8 },   // Shift
          2: { cellWidth: 15 },  // Work Order
          3: { cellWidth: 20 },  // Customer
          4: { cellWidth: 30 },  // Part
          5: { cellWidth: 12 },  // Actual
          6: { cellWidth: 12 },  // Rejected
          7: { cellWidth: 10 },  // Rej%
          8: { cellWidth: 12 },  // Good
          9: { cellWidth: 10 },  // Yield%
          10: { cellWidth: 15 }  // Rejection Type
        },
        didDrawPage: (data) => {
          // Footer
          doc.setFontSize(8);
          doc.setTextColor(100);
          const pageCount = doc.getNumberOfPages();
          doc.text(`Page ${data.pageNumber} of ${pageCount}`, data.settings.margin.left, doc.internal.pageSize.height - 10);
        }
      });
  
      // Save the PDF
      doc.save(`Production_Quality_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please check console for details.');
    }
  }

  // Helper function to format dates
  formatDate(date) {
    return date.toISOString().split('T')[0]; // Formats as YYYY-MM-DD
  }

  

  dateRanges = [
    { label: 'Last 7 Days', value: '7days' },
    { label: 'Last 30 Days', value: '30days' },
    { label: 'September 2024', value: 'sept2024' },
    { label: 'October 2024', value: 'oct2024' },
    { label: 'September - October 2024', value: 'sept-oct' }
  ];
  machines = [
    { machineNumber: 'PCM-15/50T', productionPercent: 105.65 },
    { machineNumber: 'PCM-08/130T', productionPercent: 96.82 },
    { machineNumber: 'PCM-12/110T', productionPercent: 95.96 },
    { machineNumber: 'PCM-10/90T', productionPercent: 92.91 },
    { machineNumber: 'PCM-01/150T', productionPercent: 90.12 },
    { machineNumber: 'PCM-14/50T', productionPercent: 88.42 },
    // Add more if needed
  ];
  
  machineList = [
    { label: 'All Machines', value: 'all' },
    { label: 'PCM-1 / 150T', value: 'PCM-1' },
    { label: 'PCM-2 / 200T', value: 'PCM-2' },
    { label: 'PCM-3 / 250T', value: 'PCM-3' },
    { label: 'PCM-4 / 300T', value: 'PCM-4' }
  ];
  parts = [
    { description: 'CAP INSPECTION HOLE N0010600', rejection: 5 },
    { description: 'Plug (Sc. Socket) BW0052N60004', rejection: 4 },
    { description: 'USB HOLDER G4221180', rejection: 4 },
    { description: 'SDin Top Enclosure with display & 4 ports', rejection: 4 },
    { description: 'OIL STRAINER G2082390', rejection: 4 },
    { description: 'Ball Socket Assly 408 516210009...', rejection: 4 },
    // Add up to 61+ dummy records if needed for full pagination demo
  ];
  partList = [
    { label: 'Side Cap Gear Cover New', value: 'Side Cap Gear Cover New' },
    { label: 'Gear Cover (New)', value: 'Gear Cover New' },
    { label: 'Bracket Assembly', value: 'Bracket Assembly' },
    { label: 'Housing Unit', value: 'Housing Unit' }
  ];
  rejectionList = [
    { label: 'Flow Mark', value: 'Flow Mark' },
    { label: 'Flash', value: 'Flash' },
    { label: 'Damage', value: 'Damage' },
    { label: 'Silver Streaks', value: 'Silver Streaks' },
    { label: 'Air Vent Mark', value: 'Air Vent Mark' },
    { label: 'Shrinkage', value: 'Shrinkage' },
    { label: 'Oil Patch', value: 'Oil Patch' }
  ];
  
  selectedDate = this.dateRanges[4];
  selectedMachine :any;
  selectedPart :any;
  selectedRejection :any;

  partData = [
    { part: 'Dust Cap (SC HD) 143', inspected: 1614632, rejected: 16382, rejectionPercent: 0.63 },
    { part: 'Soufflet For Heater 2048433', inspected: 975261, rejected: 962, rejectionPercent: 0.08 },
    { part: 'Bobbin TopCapilator (ECO) 2049129', inspected: 519848, rejected: 278, rejectionPercent: 0.05 },
    { part: 'Dummy Cell (SC HD) 143', inspected: 920, rejected: 0, rejectionPercent: 0 },
    { part: 'Upper Check (Eurocell Lower Check 915)', inspected: 8215, rejected: 209, rejectionPercent: 0.08 },
    { part: 'Dust Cap (SC4040 HD) 1002', inspected: 79159, rejected: 275, rejectionPercent: 0.35 },
    { part: 'DyT Cap (HD) 102', inspected: 70128, rejected: 0, rejectionPercent: 0 }
  ];

  paretoData = [
    { defect: 'Flow Mark', qty: 9058, rejectionPercent: 0.316 },
    { defect: 'Flash', qty: 5991, rejectionPercent: 0.211 },
    { defect: 'Damage', qty: 359, rejectionPercent: 0.013 },
    { defect: 'Silver streaks', qty: 301, rejectionPercent: 0.011 },
    { defect: 'Air Vent Mark', qty: 250, rejectionPercent: 0.009 },
    { defect: 'Shrinkage', qty: 249, rejectionPercent: 0.009 },
    { defect: 'Oil Patch', qty: 250, rejectionPercent: 0.009 },
  ];

  tableData = [
    { 
        date: new Date('2025-05-1'),
        shift: '1', 
        workOrder: '21462', 
        customer: 'DUMMY CELL', 
        part: 'Side Cap Gear Cover New',
        actual: 30000, 
        reject: 20099, 
        rejectionPercent: 0.67,
        rejectionType: 'Flow Mark'
    },
    { 
        date: new Date('2025-05-2'),
        shift: '2', 
        workOrder: '21463', 
        customer: 'Soufflet', 
        part: 'Gear Cover (New)',
        actual: 50000, 
        reject: 962, 
        rejectionPercent: 0.08,
        rejectionType: 'Flash'
    },
    { 
        date: new Date('2025-05-1'),
        shift: '1', 
        workOrder: '21464', 
        customer: 'Bobbin', 
        part: 'Bracket Assembly',
        actual: 40000, 
        reject: 278, 
        rejectionPercent: 0.07,
        rejectionType: 'Damage'
    },
    { 
        date: new Date('2024-04-21'),
        shift: '2', 
        workOrder: '21465', 
        customer: 'Upper Check', 
        part: 'Housing Unit',
        actual: 8215, 
        reject: 209, 
        rejectionPercent: 0.08,
        rejectionType: 'Silver Streaks'
    },
    { 
        date: new Date('2024-04-22'),
        shift: '1', 
        workOrder: '21466', 
        customer: 'Test Customer', 
        part: 'Side Cap Gear Cover New',
        actual: 25000, 
        reject: 150, 
        rejectionPercent: 0.06,
        rejectionType: 'Flash'
    },
];

  paretoChartData = {
    labels: this.paretoData.map(p => p.defect),
    datasets: [
      {
        label: 'Rejection Quantity',
        backgroundColor: '#42A5F5',
        data: this.paretoData.map(p => p.qty)
      },
      {
        label: 'Rejection %',
        backgroundColor: '#FF6384',
        data: this.paretoData.map(p => p.rejectionPercent)
      }
    ]
  };

  paretoChartOptions = {
    responsive: true,
    scales: {
      y: { beginAtZero: true }
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return context.dataset.label + ': ' + context.raw + '%';
          }
        }
      },
      datalabels: {
        // color: '#fff', // White text (adjust as needed)
        font: {
          weight: 'bold',
          size: 12 // Slightly smaller than doughnut labels
        },
        anchor: 'top', // Places labels at the end of bars (outside)
        align: 'top', // Aligns above the anchor point
        offset: 5, // Small offset for spacing
        formatter: (value: number) => {
          return value ; // Display raw value + '%'
        }}
    },
  };

  constructor() {
    this.filteredData = [...this.tableData];

    this.calculateQualityStats(this.filteredData);
  }
  
  calculateQualityStats(data: any[]) {
    // Reset all counters
    this.inspectQty = 0;
    this.rejectionQty = 0;
    this.rejectionPercentage = 0;
  
    // Calculate sums in one loop
    data.forEach(item => {
      this.inspectQty += item.actual;
      this.rejectionQty += item.reject;
    });
  
    // Calculate rejection percentage (with safeguard against division by zero)
    this.rejectionPercentage = this.inspectQty > 0 
      ? (this.rejectionQty / this.inspectQty * 100).toFixed(2)
      : 0;
  }
  applyListFilters() {
    this.filteredData = this.tableData.filter(item => {
      // Date range filter
      if (this.rangeDates && this.rangeDates[0] && this.rangeDates[1]) {
        const startDate = new Date(this.rangeDates[0]);
        const endDate = new Date(this.rangeDates[1]);
        endDate.setHours(23, 59, 59, 999); // Include entire end date
        
        if (item.date < startDate || item.date > endDate) {
          return false;
        }
      }

      // Part filter
      if (this.selectedPart && item.part !== this.selectedPart.value) {
        return false;
      }

      // Rejection type filter
      if (this.selectedRejection && item.rejectionType !== this.selectedRejection.value) {
        return false;
      }

      return true;
    });

    this.calculateQualityStats(this.filteredData);
  }

  resetFilters() {
    this.rangeDates = undefined;
    this.selectedPart = null;
    this.selectedRejection = null;
    this.filteredData = [...this.tableData];
  }


}
