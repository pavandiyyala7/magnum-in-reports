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
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import pluginDatalabels from 'chartjs-plugin-datalabels';
import { SplitButtonModule } from 'primeng/splitbutton';
import { TabViewModule } from 'primeng/tabview';
import { OEEReportComponent } from '../oee-report/oee-report.component';
import { PDCComponent } from '../pdc/pdc.component';

import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-oee',
  standalone: true,
  imports: [CommonModule, ProgressSpinnerModule, ProgressSpinnerModule, CalendarModule,
    TableModule,
    DropdownModule,
    ChartModule,
    CardModule, 
    FormsModule,
    ButtonModule,
    RippleModule,
    TooltipModule,
    SplitButtonModule,
    TabViewModule,
    OEEReportComponent,
    PDCComponent],
  templateUrl: './oee.component.html',
  styleUrl: './oee.component.scss'
})
export class OEEComponent implements OnInit {

  selectedLabel = 'Export';
  selectedIcon = 'pi pi-upload';

  filteredData = [];

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
  totalPerformance: any;
  totalQuality: any;
  totalOEE: any;
  totalDowntime: any;
  avgAvailability: string;
  avgPerformance: string;
  avgQuality: string;
  avgOEE: string;
  totalAvailability: any;
  totalRecords: number;


  exportToExcel() {
    if (this.machineData.length === 0) {
      console.warn('No machine data to export');
      return;
    }
  
    // Format data for Excel
    const formattedData = this.machineData.map(machine => ({
      'Machine': machine.machine,
      'Availability (%)': machine.availability,
      'Performance (%)': machine.performance,
      'Quality (%)': machine.quality,
      'OEE (%)': machine.oee,
      'Downtime (hours)': machine.downtime
    }));
  
    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    
    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Machine OEE Data');
    
    // Set column widths
    const wscols = [
      {wch: 20}, // Machine
      {wch: 15}, // Availability
      {wch: 15}, // Performance
      {wch: 15}, // Quality
      {wch: 15}, // OEE
      {wch: 15}  // Downtime
    ];
    worksheet['!cols'] = wscols;
    
    // Generate Excel file with timestamp
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[-:T]/g, '');
    XLSX.writeFile(workbook, `Machine_OEE_Data_${timestamp}.xlsx`);
  }
  
  exportToPDF() {
    if (this.machineData.length === 0) {
      console.warn('No machine data to export');
      return;
    }
  
    try {
      // Create new PDF document
      const doc = new jsPDF('l', 'mm', 'a4'); // landscape, millimeters, A4 size
  
      // Add title
      doc.setFontSize(18);
      doc.setTextColor(40);
      doc.setFont('helvetica', 'bold');
      doc.text('Machine OEE Data Report', 14, 20);
  
      // Add timestamp
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      const timestamp = new Date().toLocaleString();
      doc.text(`Generated on: ${timestamp}`, 14, 27);
  
      // Prepare data for PDF table
      const headers = [
        ['Machine', 'Availability (%)', 'Performance (%)', 'Quality (%)', 'OEE (%)', 'Downtime (hours)']
      ];
  
      const data = this.machineData.map(machine => [
        machine.machine,
        machine.availability.toFixed(2),
        machine.performance.toFixed(2),
        machine.quality.toFixed(2),
        machine.oee.toFixed(2),
        machine.downtime.toFixed(1)
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
          fontStyle: 'bold'
        },
        styles: {
          fontSize: 9,
          cellPadding: 3,
          overflow: 'linebreak',
          valign: 'middle'
        },
        columnStyles: {
          0: { cellWidth: 30, halign: 'left' },
          1: { cellWidth: 20, halign: 'right' },
          2: { cellWidth: 20, halign: 'right' },
          3: { cellWidth: 20, halign: 'right' },
          4: { cellWidth: 15, halign: 'right' },
          5: { cellWidth: 20, halign: 'right' }
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
      doc.save(`Machine_OEE_Data_${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please check console for details.');
    }
  }

  lossAnalysisData = {
    labels: ['Planned Downtime', 'Unplanned Downtime', 'Setup & Adjustments', 'Reduced Speed', 'Small Stops', 'Quality Losses'],
    datasets: [
        {
            data: [25, 15, 20, 15, 10, 15],
            backgroundColor: [
                '#FF6384',
                '#36A2EB',
                '#FFCE56',
                '#4BC0C0',
                '#9966FF',
                '#FF9F40'
            ]
        }
    ]
};

pieChartOptions = {
    plugins: {
        legend: {
            position: 'right'
        },
        tooltip: {
            callbacks: {
                label: (context: any) => {
                    const label = context.label || '';
                    const value = context.raw || 0;
                    const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                    const percentage = Math.round((value / total) * 100);
                    return `${label}: ${value}min (${percentage}%)`;
                }
            }
        }
    }
};

lossAnalysisTableData = [
    { category: 'Planned Downtime', duration: 120, percentage: 25, frequency: 5, mttr: 24 },
    { category: 'Unplanned Downtime', duration: 72, percentage: 15, frequency: 12, mttr: 6 },
    { category: 'Setup & Adjustments', duration: 96, percentage: 20, frequency: 8, mttr: 12 },
    { category: 'Reduced Speed', duration: 72, percentage: 15, frequency: 0, mttr: 0 },
    { category: 'Small Stops', duration: 48, percentage: 10, frequency: 24, mttr: 2 },
    { category: 'Quality Losses', duration: 72, percentage: 15, frequency: 6, mttr: 12 }
];

reportTypes = [
    { label: 'Daily Report', value: 'daily' },
    { label: 'Weekly Report', value: 'weekly' },
    { label: 'Monthly Report', value: 'monthly' },
    { label: 'Custom Report', value: 'custom' }
];

selectedReportType = this.reportTypes[0];

reportData = [
    { date: '2024-01-01', machine: 'PCM-16/25T', availability: 45, performance: 45, quality: 98, oee: 20, plannedProduction: 1000, actualProduction: 950 },
    { date: '2024-01-02', machine: 'PCM-16/25T', availability: 50, performance: 48, quality: 97, oee: 23, plannedProduction: 1000, actualProduction: 980 },
    { date: '2024-01-03', machine: 'PCM-16/25T', availability: 55, performance: 50, quality: 99, oee: 27, plannedProduction: 1000, actualProduction: 990 },
    // Add more report data as needed
];
  lastUpdated = new Date();
  rangeDates: Date[] | undefined;
  selectedMachine: any ;
  selectedShopfloor: any ;
  selectedDepartment: any ;
  
  pluginDatalabels = pluginDatalabels;

  data: any;
  rejectionData: any;
  options: any;
  
  
    ngOnInit() {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--text-color');
      const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
  
      this.filteredReportData = [...this.reportData];
      this.filteredMachineData = [...this.machineData];
      
      this.data = {
        labels: ['Production', 'Remaining'],
      datasets: [{
        data: [78, 22],
        backgroundColor: ['#007ad9', '#aed8e6'],
        borderWidth: 0
      }]
      };
      
      this.rejectionData = {
        labels: ['Rejection', 'Good'],
      datasets: [{
        data: [3, 97],
        backgroundColor: ['#007ad9', '#aed8e6'],
        borderWidth: 0
      }]
        
      };
      
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
  
    

    updateVisualizations() {
      // Update your charts based on filtered data
      // For example, update the lossAnalysisData based on filtered data
      // This is just a placeholder - adjust according to your needs
      const totalDowntime = this.filteredMachineData.reduce((sum, machine) => sum + machine.downtime, 0);
      
      // Update pie chart data if needed
      if (totalDowntime > 0) {
        this.lossAnalysisData.datasets[0].data = [
          Math.round(totalDowntime * 0.25),
          Math.round(totalDowntime * 0.15),
          Math.round(totalDowntime * 0.20),
          Math.round(totalDowntime * 0.15),
          Math.round(totalDowntime * 0.10),
          Math.round(totalDowntime * 0.15)
        ];
      }
      
      // Update other visualizations as needed
    }
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

  filteredReportData: any[] = [];
  filteredMachineData: any[] = [];

  selectedDateRange: any;
  // selectedMachine: any;

  availability = 80;
  performance = 83;
  quality = 97;
  oee = 64;

  barChartData = {
    labels: ['Nov, 2024', 'Dec, 2024', 'Sept, 2024', 'Oct, 2024', 'Aug, 2024', 'Jul, 2024'],
    datasets: [
      {
        label: 'OEE',
        backgroundColor: '#42A5F5',
        data: [86, 83, 62, 59, 58, 56]
      }
    ]
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

  machineData = [
    { date: new Date('2024-1-15'), machine: 'PCM-1 / 150T', shopFloor: 'pdc', department: 'maintenance', availability: 45.43, performance: 45.43, quality: 98.39, oee: 20.11, downtime: 1223 },
    { date: new Date('2025-5-2'), machine: 'PCM-1 / 150T', shopFloor: 'pdc', department: 'maintenance', availability: 70.77, performance: 69.65, quality: 98.57, oee: 48.75, downtime: 676.3 },
    { date: new Date('2025-5-1'), machine: 'PCM-1 / 150T', shopFloor: 'pdc', department: 'maintenance', availability: 69.65, performance: 65.31, quality: 99.11, oee: 44.85, downtime: 563.4 },
    { date: new Date('2025-5-1'), machine: 'PCM-4 / 300T', shopFloor: 'pdc', department: 'maintenance', availability: 91.95, performance: 92.31, quality: 97.85, oee: 82.75, downtime: 58.5 },
    { date: new Date('2024-3-5'), machine: 'PCM-3 / 250T', shopFloor: 'pdc', department: 'maintenance', availability: 67.11, performance: 77.53, quality: 92.65, oee: 48.01, downtime: 493.1 },
    { date: new Date('2024-3-12'), machine: 'PCM-2 / 200T', shopFloor: 'pdc', department: 'maintenance', availability: 88.53, performance: 87.93, quality: 90.45, oee: 70.32, downtime: 482.9 },
    { date: new Date('2024-2-18'), machine: 'PCM-4 / 300T', shopFloor: 'pdc', department: 'maintenance', availability: 79.39, performance: 77.39, quality: 91.65, oee: 56.16, downtime: 491.6 },
    { date: new Date('2024-1-29'), machine: 'PCM-3 / 250T', shopFloor: 'pdc', department: 'maintenance', availability: 75.57, performance: 71.87, quality: 90.12, oee: 48.81, downtime: 318.3 },
    { date: new Date('2024-2-25'), machine: 'PCM-2 / 200T', shopFloor: 'pdc', department: 'maintenance', availability: 75.27, performance: 78.53, quality: 92.19, oee: 54.31, downtime: 316.3 },
    { date: new Date('2024-3-1'), machine: 'PCM-1 / 150T', shopFloor: 'pdc', department: 'maintenance', availability: 77.19, performance: 74.71, quality: 91.27, oee: 52.74, downtime: 263.1 },
    { date: new Date('2024-1-10'), machine: 'PCM-4 / 300T', shopFloor: 'pdc', department: 'maintenance', availability: 91.32, performance: 89.32, quality: 90.65, oee: 73.89, downtime: 213.2 },
    { date: new Date('2024-2-15'), machine: 'PCM-3 / 250T', shopFloor: 'pdc', department: 'maintenance', availability: 93.25, performance: 89.99, quality: 88.85, oee: 74.20, downtime: 197.1 },
    { date: new Date('2024-3-8'), machine: 'PCM-2 / 200T', shopFloor: 'pdc', department: 'maintenance', availability: 91.89, performance: 91.79, quality: 89.95, oee: 75.52, downtime: 189.2 },
    { date: new Date('2024-1-5'), machine: 'PCM-2 / 200T', shopFloor: 'pdc', department: 'maintenance', availability: 95.25, performance: 93.65, quality: 92.85, oee: 82.85, downtime: 164.5 },
    { date: new Date('2024-2-22'), machine: 'PCM-1 / 150T', shopFloor: 'pdc', department: 'maintenance', availability: 90.45, performance: 91.15, quality: 87.65, oee: 72.12, downtime: 155.7 },
    { date: new Date('2024-3-3'), machine: 'PCM-4 / 300T', shopFloor: 'pdc', department: 'maintenance', availability: 92.75, performance: 91.55, quality: 88.55, oee: 74.51, downtime: 148.7 },
    { date: new Date('2024-1-18'), machine: 'PCM-4 / 300T', shopFloor: 'pdc', department: 'maintenance', availability: 89.35, performance: 87.95, quality: 89.95, oee: 70.43, downtime: 142.1 },
    { date: new Date('2024-2-8'), machine: 'PCM-3 / 250T', shopFloor: 'pdc', department: 'maintenance', availability: 95.89, performance: 93.25, quality: 90.85, oee: 81.12, downtime: 126.3 },
    { date: new Date('2024-3-15'), machine: 'PCM-1 / 150T', shopFloor: 'pdc', department: 'maintenance', availability: 93.55, performance: 92.45, quality: 88.15, oee: 76.41, downtime: 117.2 },
    { date: new Date('2024-1-25'), machine: 'PCM-2 / 200T', shopFloor: 'pdc', department: 'maintenance', availability: 57.14, performance: 65.71, quality: 81.65, oee: 36.25, downtime: 533.5 }
];
  constructor() {
    this.filteredData = [...this.machineData];

    this.calculateMachineStats(this.filteredData);
  } 

  calculateMachineStats(data: any[]) {
    // Reset all counters
    this.totalRecords = data.length;
    this.totalAvailability = 0;
    this.totalPerformance = 0;
    this.totalQuality = 0;
    this.totalOEE = 0;
    this.totalDowntime = 0;
  
    // Calculate sums in one loop
    data.forEach(item => {
      this.totalAvailability += item.availability;
      this.totalPerformance += item.performance;
      this.totalQuality += item.quality;
      this.totalOEE += item.oee;
      this.totalDowntime += item.downtime;
    });
  
    // Calculate averages
    this.avgAvailability = (this.totalAvailability / this.totalRecords).toFixed(1);
    this.avgPerformance = (this.totalPerformance / this.totalRecords).toFixed(1);
    this.avgQuality = (this.totalQuality / this.totalRecords).toFixed(1);
    this.avgOEE = (this.totalOEE / this.totalRecords).toFixed(1);
  }
  
applyFilters() {
  this.filteredData = this.machineData.filter(item => {
    if (this.rangeDates && this.rangeDates[0] && this.rangeDates[1]) {
      const filterStartDate = new Date(this.rangeDates[0]);
      const endDate = new Date(this.rangeDates[1]);
      endDate.setHours(23, 59, 59, 999); // Include entire end date
      
      if (item.date < filterStartDate || item.date > endDate) {
        return false;
      }
    }

    if (this.selectedShopfloor && item.shopFloor !== this.selectedShopfloor.value) {
      return false;
    }

    if (this.selectedDepartment && item.department !== this.selectedDepartment.value) {
      return false;
    }

    if (this.selectedMachine && item.machine !== this.selectedMachine.value) {
      return false;
    }

    return true;
  });

  this.updateVisualizations();
  this.calculateMachineStats(this.filteredData);
}

resetFilters() {
  this.rangeDates = [];
  this.selectedShopfloor = null;
  this.selectedDepartment = null;
  this.selectedMachine = null;
  this.filteredData = [...this.machineData];
  this.updateVisualizations();
}
  getDowntimeColor(downtime: number): string {
    if (downtime > 1000) return '#f44336'; // deep red
    if (downtime > 500) return '#e57373';  // light red
    if (downtime > 100) return '#ffcdd2';  // very light red
    return '';
  }

  

}
