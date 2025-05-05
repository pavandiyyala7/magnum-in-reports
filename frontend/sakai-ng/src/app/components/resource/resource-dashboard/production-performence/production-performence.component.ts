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
  selector: 'app-production-performence',
  standalone: true,
  imports: [CommonModule,CalendarModule, SplitButtonModule,
    TableModule,
    DropdownModule,
    ChartModule,
    CardModule, 
    FormsModule,
    ButtonModule,
    RippleModule,
    TooltipModule],
  templateUrl: './production-performence.component.html',
  styleUrl: './production-performence.component.scss'
})
export class ProductionPerformenceComponent  implements OnInit {

    lastUpdated = new Date();
    rangeDates: Date[] | undefined;
    selectedShopfloor: any ;
    selectedDepartment: any ;
    filteredData = [];

    pluginDatalabels = pluginDatalabels;

    productionPercentageByMachine: any[] = [];
    rejectionPercentageByPart: any[] = [];
    
    data: any;
    rejectionData: any;
    options: any;
    
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
    if (this.productionData.length === 0) {
      console.warn('No production data to export');
      return;
    }
  
    // Format data for Excel
    const formattedData = this.productionData.map(record => ({
      'Date': this.formatDate(record.date),
      'Machine': record.machine,
      'Shift': record.shift,
      'Part': record.part,
      'Planned Qty': record.planned,
      'Produced Qty': record.produced,
      'Rejected Qty': record.rejection,
      'Actual Cycle Time (sec)': record.actualCycle,
      'Operating Time (hrs)': record.operatingTime,
      'Downtime (hrs)': record.downTime,
      'Efficiency (%)': ((record.produced / record.planned) * 100).toFixed(2),
      'Rejection Rate (%)': ((record.rejection / record.produced) * 100).toFixed(2)
    }));
  
    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    
    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Production Data');
    
    // Set column widths
    const wscols = [
      {wch: 12},  // Date
      {wch: 20},  // Machine
      {wch: 10},  // Shift
      {wch: 25},  // Part
      {wch: 15},  // Planned
      {wch: 15},  // Produced
      {wch: 15},  // Rejected
      {wch: 20},  // Actual Cycle
      {wch: 18},  // Operating Time
      {wch: 15},  // Downtime
      {wch: 15},  // Efficiency
      {wch: 15}   // Rejection Rate
    ];
    worksheet['!cols'] = wscols;
    
    // Generate Excel file with timestamp
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[-:T]/g, '');
    XLSX.writeFile(workbook, `Production_Data_${timestamp}.xlsx`);
  }
  
  exportToPDF() {
    if (this.productionData.length === 0) {
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
      doc.text('Production Data Report', 14, 20);
  
      // Add timestamp
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      const timestamp = new Date().toLocaleString();
      doc.text(`Generated on: ${timestamp}`, 14, 27);
  
      // Prepare data for PDF table
      const headers = [
        ['Date', 'Machine', 'Shift', 'Part', 'Planned', 'Produced', 'Rejected', 
         'Cycle Time', 'Op. Time', 'Downtime', 'Efficiency', 'Rej. Rate']
      ];
  
      const data = this.productionData.map(record => [
        this.formatDate(record.date),
        record.machine,
        record.shift,
        record.part,
        record.planned.toString(),
        record.produced.toString(),
        record.rejection.toString(),
        record.actualCycle.toFixed(2),
        record.operatingTime.toFixed(1),
        record.downTime.toFixed(1),
        ((record.produced / record.planned) * 100).toFixed(2),
        ((record.rejection / record.produced) * 100).toFixed(2)
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
          fontSize: 7,
          cellPadding: 2,
          overflow: 'linebreak',
          valign: 'middle'
        },
        columnStyles: {
          0: { cellWidth: 15 },  // Date
          1: { cellWidth: 20 },  // Machine
          2: { cellWidth: 10 },  // Shift
          3: { cellWidth: 25 },  // Part
          4: { cellWidth: 12 },  // Planned
          5: { cellWidth: 12 },  // Produced
          6: { cellWidth: 12 },  // Rejected
          7: { cellWidth: 12 },  // Cycle Time
          8: { cellWidth: 12 },  // Operating Time
          9: { cellWidth: 12 },  // Downtime
          10: { cellWidth: 12 }, // Efficiency
          11: { cellWidth: 12 }  // Rejection Rate
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
      doc.save(`Production_Data_${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please check console for details.');
    }
  }
  
  // Helper function to format dates
  private formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  }

  private getProductionPercentageByMachine(data: any[]) {
    const machineMap = new Map<string, { totalProduced: number, totalRejection: number }>();
  
    data.forEach(entry => {
      if (!machineMap.has(entry.machine)) {
        machineMap.set(entry.machine, { totalProduced: 0, totalRejection: 0 });
      }
      const machineData = machineMap.get(entry.machine);
      machineData!.totalProduced += entry.produced;
      machineData!.totalRejection += entry.rejection;
    });
  
    return Array.from(machineMap.entries()).map(([machine, stats]) => {
      const total = stats.totalProduced + stats.totalRejection;
      return {
        machine,
        totalProduced: stats.totalProduced,
        totalRejection: stats.totalRejection,
        productionPercentage: total > 0 ? parseFloat(((stats.totalProduced / total) * 100).toFixed(2)) : 0,
        rejectionPercentage: total > 0 ? parseFloat(((stats.totalRejection / total) * 100).toFixed(2)) : 0
      };
    });
  }
  
  // Function to generate rejection percentage by part
  private getRejectionPercentageByPart(data: any[]) {
    const partMap = new Map<string, { totalProduced: number, totalRejection: number }>();
  
    data.forEach(entry => {
      const normalizedPart = entry.part.trim();
      if (!partMap.has(normalizedPart)) {
        partMap.set(normalizedPart, { totalProduced: 0, totalRejection: 0 });
      }
      const partData = partMap.get(normalizedPart);
      partData!.totalProduced += entry.produced;
      partData!.totalRejection += entry.rejection;
    });
  
    return Array.from(partMap.entries()).map(([part, stats]) => {
      const total = stats.totalProduced + stats.totalRejection;
      return {
        part,
        totalProduced: stats.totalProduced,
        totalRejection: stats.totalRejection,
        rejectionPercentage: total > 0 ? parseFloat(((stats.totalRejection / total) * 100).toFixed(2)) : 0
      };
    });
  }

  updateChartData() {
    this.updateProductionGaugeData();
    this.updateRejectionGaugeData();
  }
  
  private updateProductionGaugeData() {
    if (this.productionPercentageByMachine.length > 0) {
      // Calculate average production percentage across all machines
      const avgProduction = parseFloat((this.productionPercentageByMachine.reduce(
        (sum, machine) => sum + machine.productionPercentage, 0
      ) / this.productionPercentageByMachine.length).toFixed(2));
      
      const remaining = parseFloat((100 - avgProduction).toFixed(2));
      
      this.data = {
        labels: ['Production', 'Remaining'],
        datasets: [{
          data: [avgProduction, remaining],
          backgroundColor: ['#007ad9', '#aed8e6'],
          borderWidth: 0
        }]
      };
      
      this.productionGaugeData = {
        labels: ['Production', 'Remaining'],
        datasets: [{
          data: [avgProduction, remaining],
          backgroundColor: ['#007ad9', '#b6c0e6'],
          borderWidth: 0
        }]
      };
    }
  }
  
  private updateRejectionGaugeData() {
    if (this.rejectionPercentageByPart.length > 0) {
      // Calculate average rejection percentage across all parts
      const avgRejection = parseFloat((this.rejectionPercentageByPart.reduce(
        (sum, part) => sum + part.rejectionPercentage, 0
      ) / this.rejectionPercentageByPart.length).toFixed(2));
      
      const good = parseFloat((100 - avgRejection).toFixed(2));
      
      this.rejectionData = {
        labels: ['Rejection', 'Good'],
        datasets: [{
          data: [avgRejection, good],
          backgroundColor: ['#007ad9', '#aed8e6'],
          borderWidth: 0
        }]
      };
      
      this.rejectionGaugeData = {
        labels: ['Rejection', 'Good'],
        datasets: [{
          data: [avgRejection, good],
          backgroundColor: ['#e53935', '#e0e0e0'],
          borderWidth: 0
        }]
      };
    }
  }

    ngOnInit() {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--text-color');
      const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
      
      this.options = {
        rotation: -90,
        circumference: 180,
        cutout: '85%',
        maintainAspectRatio: false,
        aspectRatio: 3,
        plugins: {
          legend: {
            display: false 
          },
          tooltip: {
            callbacks: {
              label: (context: any) => {
                const label = context.label || '';
                const value = context.raw || 0;
                const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                const percentage = Math.round((value / total) * 100);
                return `${label}: ${value} (${percentage}%)`;
              }
            }
          },
          datalabels: {
            color: '#fff',
            font: {
              weight: 'bold',
              size: 16
            },
            formatter: (value: number, context: any) => {
              const total = context.chart.data.datasets[0].data.reduce((a: number, b: number) => a + b, 0);
              const percentage = Math.round((value / total) * 100);
              return `${percentage}%`;
            }
          }
        },
        elements: {
          arc: {
            borderWidth: 0
          }
        }
      };
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
      { label: 'PCM-1 / 150T', value: 'PCM-1 / 150T' },
      { label: 'PCM-2 / 200T', value: 'PCM-2 / 200T' },
      { label: 'PCM-3 / 250T', value: 'PCM-3 / 250T' },
      { label: 'PCM-4 / 300T', value: 'PCM-4 / 300T' }
    ];
    shopFloorOptions = [
      { label: 'PDC', value: 'pdc' },
      { label: 'PRODUCTION', value: 'production' },
      { label: 'QA', value: 'qa' }
    ];
  
    departmentList = [
      { label: 'Maintenance', value: 'maintenance', shopFloor: 'pdc' },
      { label: 'Tool Room', value: 'tool_room', shopFloor: 'pdc' },
      { label: 'Process Engineering', value: 'process_engineering', shopFloor: 'qa' }
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
    
    shifts = [
      { label: 'Shift 1 (6AM-2PM)', value: '1' },
      { label: 'Shift 2 (2PM-10PM)', value: '2' },
      { label: 'Shift 3 (10PM-6AM)', value: '3' }
    ];
  
    selectedDate = this.dateRanges[4];
    selectedMachine : any;
    selectedPart : any;
    selectedShift : any;
  
    summary = {
      planned: 3732035,
      produced: 3882621,
      rejection: 46885,
      operatingHours: 13562,
      downtime: 2479
    };
  
    productionGaugeData = {
      labels: ['Production', 'Remaining'],
      datasets: [{
        data: [78, 22],
        backgroundColor: ['#007ad9', '#b6c0e6'],
        borderWidth: 0
      }]
    };
  
    rejectionGaugeData = {
      labels: ['Rejection', 'Good'],
      datasets: [{
        data: [3, 97],
        backgroundColor: ['#e53935', '#e0e0e0'],
        borderWidth: 0
      }]
    };
  
    gaugeOptions = {
      cutout: '75%',
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false }
      },
      maintainAspectRatio: false,
      aspectRatio: 4,
    };
  
    monthlyProductionData = {
      labels: ['Sep 2024', 'Oct 2024'],
      datasets: [{
        label: 'Monthly Production %',
        data: [75.6, 79.4,],
        backgroundColor: '#007ad9',
        borderColor: '#005b9f',
        borderWidth: 1
      }]
    };
  
    monthlyRejectionData = {
      labels: ['Sep 2024', 'Oct 2024',],
      datasets: [{
        label: 'Monthly Rejection %',
        data: [2.0, 3.0],
        backgroundColor: '#007ad9',
        // borderColor: '#b71c1c',
        borderWidth: 1
      }]
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
  
    productionData = [
  {
    date: new Date('2024-10-01'), 
    machine: 'PCM-1 / 150T', 
    shift: '1',
    shopFloor: 'production',
    department: 'maintenance',
    part: 'Gear Cover (New)', 
    planned: 3160, 
    produced: 3191,
    rejection: 18, 
    actualCycle: 8.43, 
    operatingTime: 8, 
    downTime: 1
  },
  {
    date: new Date('2024-10-01'), 
    machine: 'PCM-1 / 150T', 
    shift: '2',
    shopFloor: 'production',
    department: 'maintenance',
    part: 'Gear Cover (New)', 
    planned: 3160, 
    produced: 3025,
    rejection: 25, 
    actualCycle: 8.67, 
    operatingTime: 7.5, 
    downTime: 2.5
  },
  {
    date: new Date('2024-10-02'), 
    machine: 'PCM-1 / 150T', 
    shift: '1',
    shopFloor: 'production',
    department: 'maintenance',
    part: 'Gear Cover New', 
    planned: 2800, 
    produced: 2850,
    rejection: 12, 
    actualCycle: 7.89, 
    operatingTime: 8, 
    downTime: 0.5
  },
  {
    date: new Date('2024-10-02'), 
    machine: 'PCM-1 / 150T', 
    shift: '2',
    shopFloor: 'production',
    department: 'maintenance',
    part: 'Side Cap Gear Cover New', 
    planned: 2800, 
    produced: 2750,
    rejection: 30, 
    actualCycle: 8.12, 
    operatingTime: 7, 
    downTime: 3
  },
  {
    date: new Date('2024-10-03'), 
    machine: 'PCM-1 / 150T', 
    shift: '1',
    shopFloor: 'production',
    department: 'tool_room',
    part: 'Bracket Assembly', 
    planned: 2500, 
    produced: 2550,
    rejection: 15, 
    actualCycle: 6.75, 
    operatingTime: 8, 
    downTime: 0
  },
  {
    date: new Date('2024-10-03'), 
    machine: 'PCM-1 / 150T', 
    shift: '2',
    shopFloor: 'production',
    department: 'tool_room',
    part: 'Bracket Assembly', 
    planned: 2500, 
    produced: 2400,
    rejection: 20, 
    actualCycle: 7.12, 
    operatingTime: 7, 
    downTime: 1
  },
  {
    date: new Date('2024-10-04'), 
    machine: 'PCM-1 / 150T', 
    shift: '1',
    shopFloor: 'production',
    department: 'process_engineering',
    part: 'Housing Unit', 
    planned: 3000, 
    produced: 3100,
    rejection: 25, 
    actualCycle: 9.12, 
    operatingTime: 8, 
    downTime: 0.5
  },
  {
    date: new Date('2024-10-04'), 
    machine: 'PCM-1 / 150T', 
    shift: '2',
    shopFloor: 'production',
    department: 'process_engineering',
    part: 'Housing Unit', 
    planned: 3000, 
    produced: 2950,
    rejection: 35, 
    actualCycle: 9.45, 
    operatingTime: 7.5, 
    downTime: 2
  },
  {
    date: new Date('2025-05-02'), 
    machine: 'PCM-1 / 150T', 
    shift: '1',
    shopFloor: 'pdc',
    department: 'maintenance',
    part: 'Gear Cover New', 
    planned: 3160, 
    produced: 3200,
    rejection: 10, 
    actualCycle: 8.23, 
    operatingTime: 8, 
    downTime: 0
  },
  {
    date: new Date('2024-10-05'), 
    machine: 'PCM-4 / 300T', 
    shift: '2',
    shopFloor: 'pdc',
    department: 'maintenance',
    part: 'Gear Cover New', 
    planned: 3160, 
    produced: 3050,
    rejection: 22, 
    actualCycle: 8.56, 
    operatingTime: 7.5, 
    downTime: 1.5
  },
  {
    date: new Date('2025-05-01'), 
    machine: 'PCM-3 / 250T', 
    shift: '1',
    shopFloor: 'pdc',
    department: 'tool_room',
    part: 'Gear Cover New', 
    planned: 3160, 
    produced: 3150,
    rejection: 15, 
    actualCycle: 8.33, 
    operatingTime: 8, 
    downTime: 0.5
  },
  {
    date: new Date('2025-05-01'), 
    machine: 'PCM-2 / 200T', 
    shift: '2',
    shopFloor: 'qa',
    department: 'process_engineering',
    part: 'Gear Cover New', 
    planned: 3160, 
    produced: 3100,
    rejection: 20, 
    actualCycle: 8.45, 
    operatingTime: 7.5, 
    downTime: 1
  }
];
  
    refreshData() {
      // Simulate data refresh
      this.lastUpdated = new Date();
      // In a real app, you would call an API here
    }
  
    exportData() {
      // Implement export functionality
      console.log('Exporting data...');
      // In a real app, this would generate a CSV or Excel file
    }  
    
    constructor() {
      this.filteredData = [...this.productionData];

      this.productionPercentageByMachine = this.getProductionPercentageByMachine(this.filteredData);
      this.rejectionPercentageByPart = this.getRejectionPercentageByPart(this.filteredData);

      this.updateChartData();
    }
    
    applyListFilters() {
      this.filteredData = this.productionData.filter(item => {
        // Date range filter
        if (this.rangeDates && this.rangeDates[0] && this.rangeDates[1]) {
          const startDate = new Date(this.rangeDates[0]);
          const endDate = new Date(this.rangeDates[1]);
          endDate.setHours(23, 59, 59, 999); // Include entire end date
          
          if (item.date < startDate || item.date > endDate) {
            return false;
          }
        }
  
        // Shopfloor filter
        if (this.selectedShopfloor && item.shopFloor !== this.selectedShopfloor.value) {
          return false;
        }
  
        // Department filter
        if (this.selectedDepartment && item.department !== this.selectedDepartment.value) {
          return false;
        }
  
        // Machine filter
        if (this.selectedMachine && item.machine !== this.selectedMachine.value) {
          return false;
        }
  
        // Part filter
        if (this.selectedPart && item.part !== this.selectedPart.value) {
          return false;
        }
  
        // Shift filter
        if (this.selectedShift && item.shift !== this.selectedShift.value) {
          return false;
        }
  
        return true;
      });

      this.productionPercentageByMachine = this.getProductionPercentageByMachine(this.filteredData);
      this.rejectionPercentageByPart = this.getRejectionPercentageByPart(this.filteredData);

      this.updateChartData();
    }
  
    resetFilters() {
      this.rangeDates = undefined;
      this.selectedShopfloor = null;
      this.selectedDepartment = null;
      this.selectedMachine = null;
      this.selectedPart = null;
      this.selectedShift = null;
      this.filteredData = [...this.productionData];
    }

    applyFilters(){
      console.log('filters is trigered in production performance')

    }
}
