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
import { SplitButtonModule } from 'primeng/splitbutton';

import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
// import 'jspdf-autotable';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-mttr-mtbf',
  standalone: true,
  imports: [CommonModule,CalendarModule,
    TableModule,
    DropdownModule,
    ChartModule,
    CardModule, 
    FormsModule,
    ButtonModule,
    RippleModule,
    TooltipModule,
    SplitButtonModule],
  templateUrl: './mttr-mtbf.component.html',
  styleUrl: './mttr-mtbf.component.scss'
})
export class MttrMtbfComponent implements OnInit {

  lastUpdated = new Date();
  rangeDates: Date[] | undefined;
  
  selectedShopfloor: any ;
  selectedDepartment: any ;
  selectedMachine : any;
  filteredData = [];

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

  // constructor() {
  //   this.filteredData = [...this.fullMachineData];
  // }

  exportToExcel() {
    if (this.fullMachineData.length === 0) {
      console.warn('No machine data to export');
      return;
    }
  
    // Format data for Excel
    const formattedData = this.fullMachineData.map(record => ({
      'Date': this.formatDate(record.date),
      'Machine': record.machine,
      'Shop Floor': record.shopFloor.toUpperCase(),
      'Department': this.formatDepartmentName(record.department),
      'Uptime (hrs)': record.uptime,
      'Downtime (hrs)': record.downtime,
      'Failures': record.failures,
      'MTBF (hrs)': record.mtbf,
      'MTTR (hrs)': record.mttr
    }));
  
    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    
    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Machine Performance');
    
    // Set column widths
    const wscols = [
      {wch: 12},  // Date
      {wch: 15},  // Machine
      {wch: 12},  // Shop Floor
      {wch: 20},  // Department
      {wch: 15},  // Uptime
      {wch: 15},  // Downtime
      {wch: 10},  // Failures
      {wch: 15},  // MTBF
      {wch: 15}   // MTTR
    ];
    worksheet['!cols'] = wscols;
    
    // Generate Excel file with timestamp
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[-:T]/g, '');
    XLSX.writeFile(workbook, `Machine_Performance_${timestamp}.xlsx`);
  }
  
  exportToPDF() {
    if (this.fullMachineData.length === 0) {
      console.warn('No machine data to export');
      return;
    }
  
    try {
      // Create new PDF document (landscape to fit all columns)
      const doc = new jsPDF('l', 'mm', 'a4');
  
      // Add title
      doc.setFontSize(18);
      doc.setTextColor(40);
      doc.setFont('helvetica', 'bold');
      doc.text('Machine Performance Report', 14, 20);
  
      // Add timestamp
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      const timestamp = new Date().toLocaleString();
      doc.text(`Generated on: ${timestamp}`, 14, 27);
  
      // Prepare data for PDF table
      const headers = [
        ['Date', 'Machine', 'Shop Floor', 'Uptime', 'Downtime', 'Failures', 'MTBF', 'MTTR']
      ];
  
      const data = this.fullMachineData.map(record => [
        this.formatDate(record.date),
        record.machine,
        record.shopFloor.toUpperCase(),
        record.uptime.toFixed(1),
        record.downtime.toFixed(1),
        record.failures.toString(),
        record.mtbf.toFixed(1),
        record.mttr.toFixed(1)
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
          0: { cellWidth: 12 },  // Date
          1: { cellWidth: 15 },  // Machine
          2: { cellWidth: 12 },  // Shop Floor
          3: { cellWidth: 12 },  // Uptime
          4: { cellWidth: 12 },  // Downtime
          5: { cellWidth: 10 },  // Failures
          6: { cellWidth: 12 },  // MTBF
          7: { cellWidth: 12 }   // MTTR
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
      doc.save(`Machine_Performance_${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please check console for details.');
    }
  }
  
  private formatDate(date: Date): string {
    return date.toLocaleDateString('en-GB'); // Formats as dd/mm/yyyy
  }
  
  private formatDepartmentName(department: string): string {
    return department.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }

  fullMachineData = [
    { 
      date: new Date('2025-05-1'),
      machine: 'PCM-1 / 150T',
      shopFloor: 'production',
      department: 'maintenance',
      uptime: 1486, 
      downtime: 13, 
      failures: 4, 
      mtbf: 26.5, 
      mttr: 13 
    },
    { 
      date: new Date('2025-05-1'),
      machine: 'PCM-1 / 150T',
      shopFloor: 'production',
      department: 'maintenance',
      uptime: 1448, 
      downtime: 1, 
      failures: 3, 
      mtbf: 0, 
      mttr: 0 
    },
    { 
      date: new Date('2025-05-2'),
      machine: 'PCM-2 / 200T',
      shopFloor: 'pdc',
      department: 'tool_room',
      uptime: 2467, 
      downtime: 7.5, 
      failures: 4, 
      mtbf: 21.42, 
      mttr: 1.88 
    },
    { 
      date: new Date('2025-01-18'),
      machine: 'PCM-2 / 200T',
      shopFloor: 'pdc',
      department: 'tool_room',
      uptime: 2653, 
      downtime: 7.5, 
      failures: 3, 
      mtbf: 30.5, 
      mttr: 7.5 
    },
    { 
      date: new Date('2025-01-19'),
      machine: 'PCM-3 / 250T',
      shopFloor: 'pdc',
      department: 'maintenance',
      uptime: 1631, 
      downtime: 0, 
      failures: 1, 
      mtbf: 0, 
      mttr: 0 
    },
    { 
      date: new Date('2025-01-20'),
      machine: 'PCM-3 / 250T',
      shopFloor: 'pdc',
      department: 'maintenance',
      uptime: 2730, 
      downtime: 19.5, 
      failures: 3, 
      mtbf: 33.33, 
      mttr: 19.5 
    },
    { 
      date: new Date('2025-01-21'),
      machine: 'PCM-4 / 300T',
      shopFloor: 'qa',
      department: 'process_engineering',
      uptime: 3313, 
      downtime: 1.5, 
      failures: 2, 
      mtbf: 10, 
      mttr: 1.5 
    },
    { 
      date: new Date('2025-01-22'),
      machine: 'PCM-4 / 300T',
      shopFloor: 'qa',
      department: 'process_engineering',
      uptime: 2710, 
      downtime: 6.5, 
      failures: 1, 
      mtbf: 0, 
      mttr: 0 
    },
    { 
      date: new Date('2025-01-23'),
      machine: 'PCM-1 / 150T',
      shopFloor: 'production',
      department: 'maintenance',
      uptime: 2328, 
      downtime: 6.33, 
      failures: 4, 
      mtbf: 25.17, 
      mttr: 6.33 
    },
    { 
      date: new Date('2025-01-24'),
      machine: 'PCM-2 / 200T',
      shopFloor: 'pdc',
      department: 'tool_room',
      uptime: 2581, 
      downtime: 17.5, 
      failures: 11, 
      mtbf: 99.5, 
      mttr: 1.75 
    },
    { 
      date: new Date('2025-01-25'),
      machine: 'PCM-3 / 250T',
      shopFloor: 'pdc',
      department: 'maintenance',
      uptime: 2843, 
      downtime: 8.5, 
      failures: 3, 
      mtbf: 121.5, 
      mttr: 2.83 
    },
    { 
      date: new Date('2025-01-26'),
      machine: 'PCM-4 / 300T',
      shopFloor: 'qa',
      department: 'process_engineering',
      uptime: 1975, 
      downtime: 3, 
      failures: 2, 
      mtbf: 34.5, 
      mttr: 7.5 
    },
    { 
      date: new Date('2025-01-27'),
      machine: 'PCM-1 / 150T',
      shopFloor: 'production',
      department: 'maintenance',
      uptime: 1915, 
      downtime: 3.5, 
      failures: 4, 
      mtbf: 19.75, 
      mttr: 1.75 
    },
    { 
      date: new Date('2025-01-28'),
      machine: 'PCM-2 / 200T',
      shopFloor: 'pdc',
      department: 'tool_room',
      uptime: 2324, 
      downtime: 15.83, 
      failures: 8, 
      mtbf: 30.5, 
      mttr: 15.83 
    },
    { 
      date: new Date('2025-01-29'),
      machine: 'PCM-3 / 250T',
      shopFloor: 'pdc',
      department: 'maintenance',
      uptime: 2002, 
      downtime: 0, 
      failures: 4, 
      mtbf: 0, 
      mttr: 0 
    },
    { 
      date: new Date('2025-01-30'),
      machine: 'PCM-4 / 300T',
      shopFloor: 'qa',
      department: 'process_engineering',
      uptime: 1003, 
      downtime: 9.33, 
      failures: 4, 
      mtbf: 19.17, 
      mttr: 9.33 
    }
  ];

  pagenateData: any[] = [];
rowsPerPage = 4;
currentPage = 0;
totalRecords = this.fullMachineData.length;

machineList = [
  { label: 'All Machines', value: 'all' },
  { label: 'PCM-1 / 150T', value: 'PCM-1' },
  { label: 'PCM-2 / 200T', value: 'PCM-2' },
  { label: 'PCM-3 / 250T', value: 'PCM-3' },
  { label: 'PCM-4 / 300T', value: 'PCM-4' }
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

constructor() {
  this.filteredData = [...this.fullMachineData];
  this.totalRecords = this.filteredData.length;
  this.updatePaginatedData();
}

ngOnInit() {
  this.updatePaginatedData();
}

get totalPages(): number {
  return Math.ceil(this.totalRecords / this.rowsPerPage);
}

isFirstPage(): boolean {
  return this.currentPage === 0;
}

isLastPage(): boolean {
  return this.currentPage === this.totalPages - 1;
}

onPageChange(event: any, page: number | 'prev' | 'next'): void {
  if (page === 'prev') {
    this.currentPage = Math.max(0, this.currentPage - 1);
  } else if (page === 'next') {
    this.currentPage = Math.min(this.totalPages - 1, this.currentPage + 1);
  } else {
    this.currentPage = page;
  }
  this.updatePaginatedData();
}

updatePaginatedData(): void {
  const startIndex = this.currentPage * this.rowsPerPage;
  const endIndex = startIndex + this.rowsPerPage;
  this.pagenateData = this.filteredData.slice(startIndex, endIndex);
  this.totalRecords = this.filteredData.length;
}

applyListFilters() {
  this.currentPage = 0; // Reset to first page when filtering
  this.filteredData = this.fullMachineData.filter(item => {
    // Date filter
    if (this.rangeDates && this.rangeDates[0] && this.rangeDates[1]) {
      const startDate = new Date(this.rangeDates[0]);
      const endDate = new Date(this.rangeDates[1]);
      endDate.setHours(23, 59, 59, 999);
      
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
    if (this.selectedMachine && !item.machine.includes(this.selectedMachine.value)) {
      return false;
    }

    return true;
  });

  this.updatePaginatedData();
}

resetListFilter() {
  this.rangeDates = [];
  this.selectedShopfloor = null;
  this.selectedDepartment = null;
  this.selectedMachine = null;
  this.currentPage = 0;
  this.filteredData = [...this.fullMachineData];
  this.updatePaginatedData();
}

}

