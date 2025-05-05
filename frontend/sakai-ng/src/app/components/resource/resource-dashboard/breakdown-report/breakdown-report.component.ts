import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { FormsModule } from '@angular/forms';
import { SplitButtonModule } from 'primeng/splitbutton';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';

import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-breakdown-report',
  standalone: true,
  imports: [TableModule,FormsModule, SplitButtonModule,DropdownModule,CalendarModule,
    CardModule,],
  templateUrl: './breakdown-report.component.html',
  styleUrl: './breakdown-report.component.scss'
})
export class BreakdownReportComponent {

  lastUpdated = new Date();
  rangeDates: Date[] | undefined;
  selectedMachine: any ;
  selectedShopfloor: any ;
  selectedDepartment: any ;
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
    { label: 'Maintenance', value: 'maintenance',  },
    { label: 'Tool Room', value: 'tool_room',  },
    { label: 'Process Engineering', value: 'process_engineering',  }
  ];

  breakdownData = [
    { 
      date: new Date('2025-05-01'),
      ticket: 1,
      login: 'XYZ',
      machineId: 'PCM-1 / 150T',
      machine: 'PCM-1 / 150T',
      shopFloor: 'production',
      department: 'maintenance',
      category: 'Mechanical',
      subCategory: 'Mech-1',
      shift: 'Shift A(08 TO 14)',
      andonAlert: '01-01-2023 11:10',
      andonAcknowledge: '01-01-2023 11:10',
      andonResolved: '01-01-2023 12:00',
      hoursRunning: 420,
      totalBreakdown: 1,
      shiftOEE: '90%',
      dayRunningHours: 890,
      dayBreakdownHours: 483,
      dayOEE: '65%'
    },
    {
      date: new Date('2025-05-01'),
      ticket: 1,
      login: 'XYZ',
      machineId: 'PCM-1 / 150T',
      shopFloor: 'production',
      department: 'maintenance',
      machine: 'PCM-1 / 150T',
      category: 'Electrical',
      subCategory: 'Elec-1',
      shift: 'Shift B(14 TO 22)',
      andonAlert: '01-01-2023 11:10',
      andonAcknowledge: '01-01-2023 11:10',
      andonResolved: '01-01-2023 13:00',
      hoursRunning: 420,
      totalBreakdown: 1,
      shiftOEE: '90%',
      dayRunningHours: 890,
      dayBreakdownHours: 482,
      dayOEE: '60%'
    },
    {
      date: new Date('2025-05-02'),
      ticket: 1,
      login: 'XYZ',
      machineId: 'PCM-2 / 200T',
      shopFloor: 'pdc',
      department: 'tool_room',
      machine: 'PCM-2 / 200T',
      category: 'Mechanical',
      subCategory: 'Mech-1',
      shift: 'Shift A(08 TO 14)',
      andonAlert: '01-01-2023 11:10',
      andonAcknowledge: '01-01-2023 11:10',
      andonResolved: '01-01-2023 12:00',
      hoursRunning: 420,
      totalBreakdown: 1,
      shiftOEE: '90%',
      dayRunningHours: 890,
      dayBreakdownHours: 483,
      dayOEE: '65%'
    },
    {
      date: new Date('2023-01-01'),
      ticket: 1,
      login: 'XYZ',
      machineId: 'PCM-2 / 200T',
      shopFloor: 'pdc',
      department: 'tool_room',
      machine: 'PCM-2 / 200T',
      category: 'Electrical',
      subCategory: 'Elec-1',
      shift: 'Shift B(14 TO 22)',
      andonAlert: '01-01-2023 11:10',
      andonAcknowledge: '01-01-2023 11:10',
      andonResolved: '01-01-2023 13:00',
      hoursRunning: 420,
      totalBreakdown: 1,
      shiftOEE: '90%',
      dayRunningHours: 890,
      dayBreakdownHours: 482,
      dayOEE: '60%'
    },
    {
      date: new Date('2023-02-01'),
      ticket: 2,
      login: 'ABC',
      machineId: 'PCM-3 / 250T',
      shopFloor: 'qa',
      department: 'process_engineering',
      machine: 'PCM-3 / 250T',
      category: 'Mechanical',
      subCategory: 'Mech-2',
      shift: 'Shift C(22 TO 06)',
      andonAlert: '02-01-2023 00:30',
      andonAcknowledge: '02-01-2023 00:45',
      andonResolved: '02-01-2023 01:30',
      hoursRunning: 400,
      totalBreakdown: 2,
      shiftOEE: '85%',
      dayRunningHours: 870,
      dayBreakdownHours: 510,
      dayOEE: '62%'
    },
    {
      date: new Date('2023-12-21'),
      ticket: 3,
      login: 'LMN',
      machineId: 'PCM-3 / 250T',
      shopFloor: 'qa',
      department: 'process_engineering',
      machine: 'PCM-3 / 250T',
      category: 'Electrical',
      subCategory: 'Elec-2',
      shift: 'Shift A(08 TO 14)',
      andonAlert: '02-01-2023 09:20',
      andonAcknowledge: '02-01-2023 09:25',
      andonResolved: '02-01-2023 10:00',
      hoursRunning: 410,
      totalBreakdown: 1,
      shiftOEE: '88%',
      dayRunningHours: 880,
      dayBreakdownHours: 470,
      dayOEE: '67%'
    },
    {
      date: new Date('2023-03-22'),
      ticket: 4,
      login: 'PQR',
      machineId: 'PCM-4 / 300T',
      shopFloor: 'production',
      department: 'maintenance',
      machine: 'PCM-4 / 300T',
      category: 'Mechanical',
      subCategory: 'Mech-3',
      shift: 'Shift B(14 TO 22)',
      andonAlert: '03-01-2023 15:15',
      andonAcknowledge: '03-01-2023 15:20',
      andonResolved: '03-01-2023 16:00',
      hoursRunning: 430,
      totalBreakdown: 1,
      shiftOEE: '92%',
      dayRunningHours: 900,
      dayBreakdownHours: 450,
      dayOEE: '70%'
    },
    {
      date: new Date('2025-03-28'),
      ticket: 5,
      login: 'XYZ',
      machineId: 'PCM-4 / 300T',
      machine: 'PCM-4 / 300T',
      shopFloor: 'production',
      department: 'maintenance',
      category: 'Electrical',
      subCategory: 'Elec-1',
      shift: 'Shift C(22 TO 06)',
      andonAlert: '03-01-2023 23:10',
      andonAcknowledge: '03-01-2023 23:20',
      andonResolved: '04-01-2023 00:30',
      hoursRunning: 415,
      totalBreakdown: 2,
      shiftOEE: '87%',
      dayRunningHours: 875,
      dayBreakdownHours: 490,
      dayOEE: '64%'
    }
  ];

  constructor() {
    this.filteredData = [...this.breakdownData];
  }
  
  applyFilters() {
    this.filteredData  = this.breakdownData.filter(item => {
      if (this.rangeDates && this.rangeDates[0] && this.rangeDates[1]) {
        const startDate = new Date(this.rangeDates[0]);
        const endDate = new Date(this.rangeDates[1]);
        endDate.setHours(23, 59, 59, 999); // Include entire end date
        
        if (item.date < startDate || item.date > endDate) {
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
  }

  resetFilters() {
    this.rangeDates = [];
    this.selectedShopfloor = null;
    this.selectedDepartment = null;
    this.selectedMachine = null;
    this.breakdownData = [...this.breakdownData];
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('en-GB'); // Formats as dd/mm/yyyy
  }

  exportToExcel() {
    if (this.breakdownData.length === 0) {
      console.warn('No breakdown data to export');
      return;
    }
  
    // Format data for Excel
    const formattedData = this.breakdownData.map(record => ({
      'Date': this.formatDate(record.date),
      'Ticket #': record.ticket,
      'Operator': record.login,
      'Machine ID': record.machineId,
      'Shop Floor': record.shopFloor,
      'Department': record.department,
      'Category': record.category,
      'Sub-Category': record.subCategory,
      'Shift': record.shift,
      'Alert Time': record.andonAlert,
      'Acknowledge Time': record.andonAcknowledge,
      'Resolved Time': record.andonResolved,
      'Downtime (mins)': this.calculateDowntimeMinutes(record.andonAlert, record.andonResolved),
      'Shift Running Hours': record.hoursRunning,
      'Shift Breakdowns': record.totalBreakdown,
      'Shift OEE': record.shiftOEE,
      'Day Running Hours': record.dayRunningHours,
      'Day Breakdown Hours': record.dayBreakdownHours,
      'Day OEE': record.dayOEE
    }));
  
    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    
    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Breakdown Data');
    
    // Set column widths
    const wscols = [
      {wch: 10},  // Date
      {wch: 10},  // Ticket #
      {wch: 15},  // Operator
      {wch: 15},  // Machine ID
      {wch: 12},  // Shop Floor
      {wch: 20},  // Department
      {wch: 15},  // Category
      {wch: 15},  // Sub-Category
      {wch: 20},  // Shift
      {wch: 20},  // Alert Time
      {wch: 20},  // Acknowledge Time
      {wch: 20},  // Resolved Time
      {wch: 15},  // Downtime (mins)
      {wch: 18},  // Shift Running Hours
      {wch: 18},  // Shift Breakdowns
      {wch: 12},  // Shift OEE
      {wch: 18},  // Day Running Hours
      {wch: 18},  // Day Breakdown Hours
      {wch: 12}   // Day OEE
    ];
    worksheet['!cols'] = wscols;
    
    // Generate Excel file with timestamp
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[-:T]/g, '');
    XLSX.writeFile(workbook, `Breakdown_Data_${timestamp}.xlsx`);
  }
  
  exportToPDF() {
    if (this.breakdownData.length === 0) {
      console.warn('No breakdown data to export');
      return;
    }
  
    try {
      // Create new PDF document (landscape to fit all columns)
      const doc = new jsPDF('l', 'mm', 'a4');
  
      // Add title
      doc.setFontSize(18);
      doc.setTextColor(40);
      doc.setFont('helvetica', 'bold');
      doc.text('Machine Breakdown Report', 14, 20);
  
      // Add timestamp
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      const timestamp = new Date().toLocaleString();
      doc.text(`Generated on: ${timestamp}`, 14, 27);
  
      // Prepare data for PDF table (simplified for PDF)
      const headers = [
        ['Date', 'Machine', 'Shop Floor', 'Category', 'Shift', 
         'Downtime', 'Alert Time', 'Resolved Time', 'Shift OEE']
      ];
  
      const data = this.breakdownData.map(record => [
        this.formatDate(record.date),
        record.machineId,
        record.shopFloor.toUpperCase(),
        record.category,
        record.shift.split('(')[0].trim(),
        this.calculateDowntimeMinutes(record.andonAlert, record.andonResolved) + ' mins',
        record.andonAlert.split(' ')[1],
        record.andonResolved.split(' ')[1],
        record.shiftOEE
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
          0: { cellWidth: 10 },  // Date
          1: { cellWidth: 15 },  // Machine
          2: { cellWidth: 12 },  // Shop Floor
          3: { cellWidth: 12 },  // Category
          4: { cellWidth: 12 },  // Shift
          5: { cellWidth: 12 },  // Downtime
          6: { cellWidth: 12 },  // Alert Time
          7: { cellWidth: 12 },  // Resolved Time
          8: { cellWidth: 10 }   // Shift OEE
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
      doc.save(`Breakdown_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please check console for details.');
    }
  }
  
  private calculateDowntimeMinutes(alertTime: string, resolvedTime: string): number {
    const alertDate = new Date(alertTime);
    const resolvedDate = new Date(resolvedTime);
    return Math.round((resolvedDate.getTime() - alertDate.getTime()) / (1000 * 60));
  }
}