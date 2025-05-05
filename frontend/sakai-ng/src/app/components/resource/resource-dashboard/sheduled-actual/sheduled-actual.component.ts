import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { DropdownModule } from 'primeng/dropdown';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import pluginDatalabels from 'chartjs-plugin-datalabels';

import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { SplitButtonModule } from 'primeng/splitbutton';

@Component({
  selector: 'app-sheduled-actual',
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
  templateUrl: './sheduled-actual.component.html',
  styleUrl: './sheduled-actual.component.scss'
})
export class SheduledActualComponent  {

  rangeDates: Date[] | undefined;
  customers = [
    { name: 'ULTRAVIOLET' },
    { name: 'SGS' },
    { name: 'SANDHAR' }
  ];
  selectedCustomers = [];
  partDescription = '';
  filteredData = [];
  scheduleSummary = [];

  totalWorkorders: number;
  totalPoQuantity: number;
  totalActualQuantity: number;
  totalPendingQuantity: number;
  totalPoValue: number;
  scheduleCompletionPercentage: number;

  pluginDatalabels = pluginDatalabels;

  barChartData = {
    labels: ['October', 'September', 'August'],
    datasets: [
      {
        label: 'Schedule vs Actual',
        data: [68, 63, 58],
        backgroundColor: ['#007bff', '#007bff', '#007bff']
      }
    ]
  };

  lineChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'PO Value',
        data: [15, 12, 14, 10, 9, 13, 17, 18, 16, 18.1],
        borderColor: '#007bff',
        fill: false
      }
    ]
  };

  lineChartOptions = {
    responsive: true,
    aspectRatio: 9,
    plugins: {
      legend: {
        display: false
      }
    }
  };

  barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { 
        beginAtZero: true, 
        max: 100,
        ticks: {
          callback: function(value: number) {
            return value + '%';
          }
        }
      }
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
          return value + '%'; // Display raw value + '%'
        }}
    },
  };

  partList = [
    { label: 'Side Cap Gear Cover New', value: 'Side Cap Gear Cover New' },
    { label: 'Gear Cover (New)', value: 'Gear Cover New' },
    { label: 'Bracket Assembly', value: 'Bracket Assembly' },
    { label: 'Housing Unit', value: 'Housing Unit' }
  ];
  
  customerList = [
    { label: 'Customer A', value: 'Customer A' },
    { label: 'Customer B', value: 'Customer B' },
    { label: 'Customer C', value: 'Customer C' },
    { label: 'Customer D', value: 'Customer D' }
  ]
  

  selectedDate = [];
  selectedCustomer : any;
  selectedDescription : any;
  
  detailedData = [
    { 
      date: new Date('2024-05-01'),
      customer: 'Customer A', 
      workorder: 1723, 
      description: 'Holder cover 6X15X170',
      partDescription: 'Side Cap Gear Cover New',
      poQuantity: 2700, 
      actualQuantity: 1800, 
      pendingQuantity: 900, 
      poValue: '52960', 
      schedulePercent: 67 
    },
    { 
      date: new Date('2024-05-02'),
      customer: 'Customer B', 
      workorder: 1702, 
      description: 'Bridge Assy 40X180',
      partDescription: 'Gear Cover New',
      poQuantity: 4400, 
      actualQuantity: 2900, 
      pendingQuantity: 1500, 
      poValue: '82560', 
      schedulePercent: 66 
    },
    { 
      date: new Date('2024-05-03'),
      customer: 'Customer C', 
      workorder: 1723, 
      description: 'Holder cover 6X15X170',
      partDescription: 'Bracket Assembly',
      poQuantity: 2700, 
      actualQuantity: 1800, 
      pendingQuantity: 900, 
      poValue: '52960', 
      schedulePercent: 67 
    },
    { 
      date: new Date('2025-05-01'),
      customer: 'Customer D', 
      workorder: 1723, 
      description: 'Holder cover 6X15X170',
      partDescription: 'Housing Unit',
      poQuantity: 2700, 
      actualQuantity: 1800, 
      pendingQuantity: 900, 
      poValue: '52960', 
      schedulePercent: 67 
    },
    { 
      date: new Date('2025-05-01'),
      customer: 'Customer A', 
      workorder: 1702, 
      description: 'Bridge Assy 40X180',
      partDescription: 'Side Cap Gear Cover New',
      poQuantity: 4400, 
      actualQuantity: 2900, 
      pendingQuantity: 1500, 
      poValue: '82560', 
      schedulePercent: 66 
    },
    { 
      date: new Date('2025-05-02'),
      customer: 'Customer B', 
      workorder: 1723, 
      description: 'Holder cover 6X15X170',
      partDescription: 'Gear Cover New',
      poQuantity: 2700, 
      actualQuantity: 1800, 
      pendingQuantity: 900, 
      poValue: '52960', 
      schedulePercent: 67 
    }
];

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

  constructor() {
    this.filteredData = [...this.detailedData];

    this.generateScheduleSummary(this.filteredData);
    this.calculateTotals(this.filteredData);
  }

  private generateScheduleSummary(data: any[]): void {
    // Clear existing data except the 'Grand total' if it exists
    const grandTotalIndex = this.scheduleSummary.findIndex(item => item.customer === 'Grand total');
    const existingGrandTotal = grandTotalIndex >= 0 ? this.scheduleSummary[grandTotalIndex] : null;
    
    this.scheduleSummary = [];
  
    // Create a map to group data by customer and calculate average schedulePercent
    const customerMap = new Map<string, { total: number, count: number }>();
    
    // Process each entry in the data
    data.forEach(entry => {
      if (!customerMap.has(entry.customer)) {
        customerMap.set(entry.customer, { total: 0, count: 0 });
      }
      const customerData = customerMap.get(entry.customer);
      customerData!.total += entry.schedulePercent;
      customerData!.count += 1;
    });
  
    // Update the scheduleSummary with customer summaries
    customerMap.forEach((stats, customer) => {
      const existingItemIndex = this.scheduleSummary.findIndex(item => item.customer === customer);
      const value = parseFloat((stats.total / stats.count).toFixed(0));
      
      if (existingItemIndex >= 0) {
        // Update existing entry
        this.scheduleSummary[existingItemIndex].value = value;
      } else {
        // Add new entry
        this.scheduleSummary.push({ customer, value });
      }
    });
  
    // Calculate and update grand total average
    const validEntries = this.scheduleSummary.filter(item => item.customer !== 'Grand total');
    const grandTotal = validEntries.length > 0 
      ? parseFloat((validEntries.reduce((sum, item) => sum + item.value, 0) / validEntries.length).toFixed(0))
      : 0;
  
    if (existingGrandTotal) {
      existingGrandTotal.value = grandTotal;
      this.scheduleSummary.push(existingGrandTotal);
    } else {
      this.scheduleSummary.push({ customer: 'Grand total', value: grandTotal });
    }
  
    // Sort the list (optional)
    this.scheduleSummary.sort((a, b) => {
      if (a.customer === 'Grand total') return 1;
      if (b.customer === 'Grand total') return -1;
      return b.value - a.value; // Sort by value descending
    });
  }

  
  calculateTotals(data:any) {
  // Reset all counters
  this.totalWorkorders = data.length;
  this.totalPoQuantity = 0;
  this.totalActualQuantity = 0;
  this.totalPendingQuantity = 0;
  this.totalPoValue = 0;

  // Sum all values in one loop
  data.forEach(item => {
    this.totalPoQuantity += item.poQuantity;
    this.totalActualQuantity += item.actualQuantity;
    this.totalPendingQuantity += item.pendingQuantity;
    this.totalPoValue += Number(item.poValue);
  });

  // Calculate completion percentage
  this.scheduleCompletionPercentage = this.totalPoQuantity > 0 
    ? Number(((this.totalActualQuantity / this.totalPoQuantity) * 100).toFixed(2))
    : 0;
}

  
  applyListFilters() {
    this.filteredData = this.detailedData.filter(item => {
      // Date range filter
      if (this.rangeDates && this.rangeDates[0] && this.rangeDates[1]) {
        const startDate = new Date(this.rangeDates[0]);
        const endDate = new Date(this.rangeDates[1]);
        endDate.setHours(23, 59, 59, 999); // Include entire end date
        
        if (item.date < startDate || item.date > endDate) {
          return false;
        }
      }

      // Customer filter
      if (this.selectedCustomer && item.customer !== this.selectedCustomer.value) {
        return false;
      }

      // Description filter
      if (this.selectedDescription && item.partDescription !== this.selectedDescription.value) {
        return false;
      }

      return true;
    });

    this.generateScheduleSummary(this.filteredData);

    this.calculateTotals(this.filteredData);
  }

  resetFilters() {
    this.rangeDates = undefined;
    this.selectedCustomer = null;
    this.selectedDescription = null;
    this.filteredData = [...this.detailedData];
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('en-GB'); // Formats as dd/mm/yyyy
  }


  exportToExcel() {
    if (this.detailedData.length === 0) {
      console.warn('No work order data to export');
      return;
    }
  
    // Format data for Excel
    const formattedData = this.detailedData.map(record => ({
      'Customer': record.customer,
      'Work Order #': record.workorder,
      'Description': record.description,
      'PO Quantity': record.poQuantity,
      'Actual Quantity': record.actualQuantity,
      'Pending Quantity': record.pendingQuantity,
      'PO Value': record.poValue,
      'Schedule %': record.schedulePercent
    }));
  
    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    
    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Work Order Data');
    
    // Set column widths
    const wscols = [
      {wch: 20}, // Customer
      {wch: 15}, // Work Order
      {wch: 30}, // Description
      {wch: 15}, // PO Quantity
      {wch: 15}, // Actual Quantity
      {wch: 15}, // Pending Quantity
      {wch: 15}, // PO Value
      {wch: 15}  // Schedule %
    ];
    worksheet['!cols'] = wscols;
    
    // Generate Excel file with timestamp
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[-:T]/g, '');
    XLSX.writeFile(workbook, `Work_Order_Data_${timestamp}.xlsx`);
  }
  
  exportToPDF() {
    if (this.detailedData.length === 0) {
      console.warn('No work order data to export');
      return;
    }
  
    try {
      // Create new PDF document (landscape orientation)
      const doc = new jsPDF('l', 'mm', 'a4');
  
      // Add title
      doc.setFontSize(18);
      doc.setTextColor(40);
      doc.setFont('helvetica', 'bold');
      doc.text('Work Order Data Report', 14, 20);
  
      // Add timestamp
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      const timestamp = new Date().toLocaleString();
      doc.text(`Generated on: ${timestamp}`, 14, 27);
  
      // Prepare data for PDF table
      const headers = [
        ['Customer', 'Work Order', 'Description', 'PO Qty', 'Actual Qty', 'Pending Qty', 'PO Value', 'Schedule %']
      ];
  
      const data = this.detailedData.map(record => [
        record.customer,
        record.workorder.toString(),
        record.description,
        record.poQuantity.toString(),
        record.actualQuantity.toString(),
        record.pendingQuantity.toString(),
        record.poValue,
        record.schedulePercent.toString()
      ]);
  
      // Add table to PDF
      autoTable(doc, {
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
          fontSize: 8,
          cellPadding: 3,
          overflow: 'linebreak',
          valign: 'middle'
        },
        columnStyles: {
          0: { cellWidth: 20, halign: 'left' },  // Customer
          1: { cellWidth: 15, halign: 'center' }, // Work Order
          2: { cellWidth: 30, halign: 'left' },   // Description
          3: { cellWidth: 12, halign: 'right' },  // PO Qty
          4: { cellWidth: 12, halign: 'right' },  // Actual Qty
          5: { cellWidth: 12, halign: 'right' },  // Pending Qty
          6: { cellWidth: 15, halign: 'right' },  // PO Value
          7: { cellWidth: 12, halign: 'right' }   // Schedule %
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
      doc.save(`Work_Order_Data_${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please check console for details.');
    }
  }
}
