import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { SplitButtonModule } from 'primeng/splitbutton';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';

import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
@Component({
  selector: 'app-oee-report',
  standalone: true,
  imports: [TableModule, CardModule, FormsModule, CalendarModule, SplitButtonModule,DropdownModule],
  templateUrl: './oee-report.component.html',
  styleUrl: './oee-report.component.scss'
})
export class OEEReportComponent {
  
  lastUpdated = new Date();
  rangeDates: Date[] | undefined;
  selectedMachine: any ;
  selectedShopfloor: any ;
  selectedDepartment: any ;
  filteredData = [];

  machineList = [
    { label: 'All Machines', value: 'all' },
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
    { label: 'Maintenance', value: 'maintenance', },
    { label: 'Tool Room', value: 'tool_room', },
    { label: 'Process Engineering', value: 'process_engineering',  }
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

  oeeData = [
    {
      name: 'PO-11-JOB0028-11-2024',
      startDate: new Date('2025-03-02'),
      shift: 'Shift-1',
      workstationType: 'Pressure die casting',
      workstation: '250T-04 PDC',
      machine: 'PCM-3 / 250T',
      shopFloor: 'pdc',
      department: 'maintenance',
      operatingTime: 720,
      machineRuntime: 600,
      downtime: 120,
      targetQty: 1600,
      completedQty: 720,
      rejectedQty: 28,
      acceptedQty: 692,
      availability: 0.83,
      performance: 0.45,
      quality: 0.96,
      oee: 0.36
    },
    {
      name: 'PO-11-JOB0028-11-2024',
      startDate: new Date('2025-04-03'),
      shift: 'Shift-2',
      workstationType: 'Pressure die casting',
      workstation: '250T-04 PDC',
      machine: 'PCM-3 / 250T',
      shopFloor: 'pdc',
      department: 'maintenance',
      operatingTime: 720,
      machineRuntime: 600,
      downtime: 120,
      targetQty: 1600,
      completedQty: 1160,
      rejectedQty: 16,
      acceptedQty: 1144,
      availability: 1,
      performance: 0.75,
      quality: 0.99,
      oee: 0.74
    },
    {
      name: 'PO-11-JOB0029-11-2024',
      startDate: new Date('2025-04-09'),
      shift: 'Shift-1',
      workstationType: 'Pressure die casting',
      workstation: '120T-02 PDC',
      machine: 'PCM-1 / 150T',
      shopFloor: 'pdc',
      department: 'tool_room',
      operatingTime: 720,
      machineRuntime: 600,
      downtime: 120,
      targetQty: 2618,
      completedQty: 1710,
      rejectedQty: 16,
      acceptedQty: 1694,
      availability: 0.83,
      performance: 0.65,
      quality: 0.99,
      oee: 0.54
    },
    {
      name: 'PO-11-JOB0029-11-2024',
      startDate: new Date('2025-05-02'),
      shift: 'Shift-2',
      workstationType: 'Pressure die casting',
      workstation: '120T-02 PDC',
      machine: 'PCM-1 / 150T',
      shopFloor: 'pdc',
      department: 'tool_room',
      operatingTime: 720,
      machineRuntime: 720,
      downtime: 0,
      targetQty: 2618,
      completedQty: 2200,
      rejectedQty: 42,
      acceptedQty: 2158,
      availability: 1,
      performance: 0.83,
      quality: 0.99,
      oee: 0.82
    },
    {
      name: 'PO-11-JOB0029-11-2024',
      startDate: new Date('2025-05-01'),
      shift: 'Shift-1',
      workstationType: 'Pressure die casting',
      workstation: '120T-02 PDC',
      machine: 'PCM-1 / 150T',
      shopFloor: 'pdc',
      department: 'tool_room',
      operatingTime: 720,
      machineRuntime: 720,
      downtime: 0,
      targetQty: 2618,
      completedQty: 2160,
      rejectedQty: 12,
      acceptedQty: 2148,
      availability: 1,
      performance: 0.83,
      quality: 0.99,
      oee: 0.82
    },
    {
      name: 'PO-11-JOB0029-11-2024',
      startDate: new Date('2025-05-01'),
      shift: 'Shift-2',
      workstationType: 'Pressure die casting',
      workstation: '120T-02 PDC',
      machine: 'PCM-1 / 150T',
      shopFloor: 'pdc',
      department: 'tool_room',
      operatingTime: 720,
      machineRuntime: 720,
      downtime: 0,
      targetQty: 2618,
      completedQty: 2220,
      rejectedQty: 20,
      acceptedQty: 2200,
      availability: 1,
      performance: 0.85,
      quality: 0.99,
      oee: 0.84
    },
    {
      name: 'PO-11-JOB0029-11-2024',
      startDate: new Date('2025-11-01'),
      shift: 'Shift-2',
      workstationType: 'Pressure die casting',
      workstation: '120T-02 PDC',
      machine: 'PCM-1 / 150T',
      shopFloor: 'pdc',
      department: 'tool_room',
      operatingTime: 720,
      machineRuntime: 600,
      downtime: 120,
      targetQty: 2618,
      completedQty: 1770,
      rejectedQty: 20,
      acceptedQty: 1750,
      availability: 1,
      performance: 0.68,
      quality: 0.99,
      oee: 0.67
    },
    {
      name: 'PO-11-JOB0030-11-2024',
      startDate: new Date('2025-11-01'),
      shift: 'Shift-1',
      workstationType: 'Pressure die casting',
      workstation: '300T-01 PDC',
      machine: 'PCM-4 / 300T',
      shopFloor: 'production',
      department: 'maintenance',
      operatingTime: 720,
      machineRuntime: 700,
      downtime: 20,
      targetQty: 2000,
      completedQty: 1800,
      rejectedQty: 30,
      acceptedQty: 1770,
      availability: 0.97,
      performance: 0.86,
      quality: 0.98,
      oee: 0.82
    },
    {
      name: 'PO-11-JOB0031-11-2024',
      startDate: new Date('2025-11-01'),
      shift: 'Shift-2',
      workstationType: 'Pressure die casting',
      workstation: '200T-03 PDC',
      machine: 'PCM-2 / 200T',
      shopFloor: 'qa',
      department: 'process_engineering',
      operatingTime: 720,
      machineRuntime: 720,
      downtime: 0,
      targetQty: 1800,
      completedQty: 1750,
      rejectedQty: 15,
      acceptedQty: 1735,
      availability: 1,
      performance: 0.81,
      quality: 0.99,
      oee: 0.80
    }
  ];

  constructor() {
    this.filteredData = [...this.oeeData];
  }

  applyFilters() {
    this.filteredData = this.oeeData.filter(item => {
      if (this.rangeDates && this.rangeDates[0] && this.rangeDates[1]) {
        const filterStartDate = new Date(this.rangeDates[0]);
        const endDate = new Date(this.rangeDates[1]);
        endDate.setHours(23, 59, 59, 999); // Include entire end date
        
        if (item.startDate < filterStartDate || item.startDate > endDate) {
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
    this.filteredData = [...this.oeeData];
  }

  exportToExcel() {
    if (this.oeeData.length === 0) {
      console.warn('No OEE data to export');
      return;
    }
  
    // Format data for Excel
    const formattedData = this.oeeData.map(record => ({
      'Job Name': record.name,
      'Date': this.formatDate(record.startDate),
      'Shift': record.shift,
      'Machine': record.machine,
      'Shop Floor': record.shopFloor.toUpperCase(),
      'Department': this.formatDepartmentName(record.department),
      'Workstation': record.workstation,
      'Operating Time (min)': record.operatingTime,
      'Machine Runtime (min)': record.machineRuntime,
      'Downtime (min)': record.downtime,
      'Target Qty': record.targetQty,
      'Completed Qty': record.completedQty,
      'Rejected Qty': record.rejectedQty,
      'Accepted Qty': record.acceptedQty,
      'Availability': (record.availability * 100).toFixed(2) + '%',
      'Performance': (record.performance * 100).toFixed(2) + '%',
      'Quality': (record.quality * 100).toFixed(2) + '%',
      'OEE': (record.oee * 100).toFixed(2) + '%'
    }));
  
    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    
    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'OEE Data');
    
    // Set column widths
    const wscols = [
      {wch: 25}, // Job Name
      {wch: 12}, // Date
      {wch: 12}, // Shift
      {wch: 15}, // Machine
      {wch: 12}, // Shop Floor
      {wch: 20}, // Department
      {wch: 15}, // Workstation
      {wch: 20}, // Operating Time
      {wch: 20}, // Machine Runtime
      {wch: 15}, // Downtime
      {wch: 12}, // Target Qty
      {wch: 15}, // Completed Qty
      {wch: 15}, // Rejected Qty
      {wch: 15}, // Accepted Qty
      {wch: 15}, // Availability
      {wch: 15}, // Performance
      {wch: 15}, // Quality
      {wch: 15}  // OEE
    ];
    worksheet['!cols'] = wscols;
    
    // Generate Excel file with timestamp
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[-:T]/g, '');
    XLSX.writeFile(workbook, `OEE_Data_${timestamp}.xlsx`);
  }
  
  exportToPDF() {
    if (this.oeeData.length === 0) {
      console.warn('No OEE data to export');
      return;
    }
  
    try {
      // Create new PDF document (landscape to fit all columns)
      const doc = new jsPDF('l', 'mm', 'a4');
  
      // Add title
      doc.setFontSize(18);
      doc.setTextColor(40);
      doc.setFont('helvetica', 'bold');
      doc.text('OEE Data Report', 14, 20);
  
      // Add timestamp
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      const timestamp = new Date().toLocaleString();
      doc.text(`Generated on: ${timestamp}`, 14, 27);
  
      // Prepare data for PDF table (simplified for PDF)
      const headers = [
        ['Date', 'Machine', 'Shift', 'Availability', 'Performance', 'Quality', 'OEE', 'Downtime (min)']
      ];
  
      const data = this.oeeData.map(record => [
        this.formatDate(record.startDate),
        record.machine,
        record.shift,
        (record.availability * 100).toFixed(2) + '%',
        (record.performance * 100).toFixed(2) + '%',
        (record.quality * 100).toFixed(2) + '%',
        (record.oee * 100).toFixed(2) + '%',
        record.downtime.toString()
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
          2: { cellWidth: 10 },  // Shift
          3: { cellWidth: 15 },  // Availability
          4: { cellWidth: 15 },  // Performance
          5: { cellWidth: 12 },  // Quality
          6: { cellWidth: 12 },  // OEE
          7: { cellWidth: 15 }   // Downtime
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
      doc.save(`OEE_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
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

}
