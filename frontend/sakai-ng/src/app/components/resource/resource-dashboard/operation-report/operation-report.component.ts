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
  selector: 'app-operation-report',
  standalone: true,
  imports: [TableModule,CardModule,FormsModule,SplitButtonModule, DropdownModule, CalendarModule],
  templateUrl: './operation-report.component.html',
  styleUrl: './operation-report.component.scss'
})
export class OperationReportComponent {

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
    { label: 'Maintenance', value: 'maintenance'},
    { label: 'Tool Room', value: 'tool_room'},
    { label: 'Process Engineering', value: 'process_engineering'}
  ];

  operationData = [
    { 
      date: new Date('2023-11-01'),
      machine: 'PCM-1 / 150T',
      shopFloor: 'production',
      department: 'maintenance', // Adding a production department
      partDescription: 'TELESONIC MIDDLE MIXING TUBE - LONG PIPE / 10001', 
      plannedQuantity: 2998, 
      actualQuantity: 2832, 
      rejectionQuantity: 0, 
      productionPercent: '94%', 
      actualManpowerUsed: 19, 
      requiredTime: 8.36, 
      actualTime: 9.00, 
      timeDifference: -0.64, 
      efficiency: '93%' 
    },
    { 
      date: new Date('2023-11-01'),
      machine: 'PCM-2 / 200T',
      shopFloor: 'pdc',
      department: 'tool_room',
      partDescription: '35 Degree Gas Valve Base (0010)', 
      plannedQuantity: 7976, 
      actualQuantity: 7961, 
      rejectionQuantity: 0, 
      productionPercent: '100%', 
      actualManpowerUsed: 16, 
      requiredTime: 132.94, 
      actualTime: 132.67, 
      timeDifference: 0.27, 
      efficiency: '100%' 
    },
    { 
      date: new Date('2023-11-02'),
      machine: 'PCM-3 / 250T',
      shopFloor: 'production',
      department: 'process_engineering',
      partDescription: '35 Degree Gas Valve Body (0009)', 
      plannedQuantity: 40195, 
      actualQuantity: 40165, 
      rejectionQuantity: 0, 
      productionPercent: '100%', 
      actualManpowerUsed: 26, 
      requiredTime: 223.31, 
      actualTime: 223.00, 
      timeDifference: 0.31, 
      efficiency: '99%' 
    },
    { 
      date: new Date('2023-11-02'),
      machine: 'PCM-4 / 300T',
      shopFloor: 'qa',
      department: 'process_engineering',
      partDescription: 'MOTOR PULLY', 
      plannedQuantity: 52042, 
      actualQuantity: 52056, 
      rejectionQuantity: 0, 
      productionPercent: '100%', 
      actualManpowerUsed: 14, 
      requiredTime: 80.87, 
      actualTime: 80.19, 
      timeDifference: -0.68, 
      efficiency: '99%' 
    },
    { 
      date: new Date('2023-11-03'),
      machine: 'PCM-1 / 150T',
      shopFloor: 'production',
      department: 'maintenance',
      partDescription: '12 PIT PKL WITH HANDLE LW (SV DIE)', 
      plannedQuantity: 5110, 
      actualQuantity: 5050, 
      rejectionQuantity: 0, 
      productionPercent: '99%', 
      actualManpowerUsed: 14, 
      requiredTime: 42.63, 
      actualTime: 42.50, 
      timeDifference: -0.13, 
      efficiency: '100%' 
    },
    { 
      date: new Date('2023-11-03'),
      machine: 'PCM-2 / 200T',
      shopFloor: 'production',
      department: 'maintenance',
      partDescription: 'PAM SHIELD 166', 
      plannedQuantity: 57420, 
      actualQuantity: 57672, 
      rejectionQuantity: 0, 
      productionPercent: '100%', 
      actualManpowerUsed: 319, 
      requiredTime: 145.01, 
      actualTime: 153.00, 
      timeDifference: -7.99, 
      efficiency: '95%' 
    },
    { 
      date: new Date('2023-11-04'),
      machine: 'PCM-3 / 250T',
      shopFloor: 'production',
      department: 'tool_room',
      partDescription: '611-CDC000122-MLNA SHIELD', 
      plannedQuantity: 43040, 
      actualQuantity: 42852, 
      rejectionQuantity: 0, 
      productionPercent: '100%', 
      actualManpowerUsed: 440, 
      requiredTime: 108.72, 
      actualTime: 113.00, 
      timeDifference: -4.28, 
      efficiency: '96%' 
    },
    { 
      date: new Date('2023-11-04'),
      machine: 'PCM-4 / 300T',
      shopFloor: 'qa',
      department: 'process_engineering',
      partDescription: '30 Degree Gas Valve Base (0005)', 
      plannedQuantity: 28300, 
      actualQuantity: 28170, 
      rejectionQuantity: 0, 
      productionPercent: '99%', 
      actualManpowerUsed: 17, 
      requiredTime: 47.22, 
      actualTime: 47.33, 
      timeDifference: -0.11, 
      efficiency: '98%' 
    },
    { 
      date: new Date('2023-11-05'),
      machine: 'PCM-1 / 150T',
      shopFloor: 'production',
      department: 'tool_room',
      partDescription: 'LPG MT012 MIXING TUBE BIG', 
      plannedQuantity: 3683, 
      actualQuantity: 3355, 
      rejectionQuantity: 0, 
      productionPercent: '91%', 
      actualManpowerUsed: 17, 
      requiredTime: 15.41, 
      actualTime: 15.25, 
      timeDifference: 0.16, 
      efficiency: '98%' 
    },
    { 
      date: new Date('2023-11-05'),
      machine: 'PCM-2 / 200T',
      shopFloor: 'production',
      department: 'maintenance',
      partDescription: '250 PANIYARKAL', 
      plannedQuantity: 3218, 
      actualQuantity: 3218, 
      rejectionQuantity: 0, 
      productionPercent: '100%', 
      actualManpowerUsed: 16, 
      requiredTime: 9.22, 
      actualTime: 9.20, 
      timeDifference: 0.02, 
      efficiency: '100%' 
    },
    { 
      date: new Date('2023-11-06'),
      machine: 'PCM-3 / 250T',
      shopFloor: 'production',
      department: 'tool_room',
      partDescription: 'DEF_063', 
      plannedQuantity: 20430, 
      actualQuantity: 20300, 
      rejectionQuantity: 0, 
      productionPercent: '99%', 
      actualManpowerUsed: 72, 
      requiredTime: 113.80, 
      actualTime: 115.00, 
      timeDifference: -1.20, 
      efficiency: '98%' 
    },
    { 
      date: new Date('2025-05-01'),
      machine: 'PCM-4 / 300T',
      shopFloor: 'qa',
      department: 'process_engineering',
      partDescription: 'VPDC FRY PAN - 240', 
      plannedQuantity: 163, 
      actualQuantity: 168, 
      rejectionQuantity: 0, 
      productionPercent: '100%', 
      actualManpowerUsed: 6, 
      requiredTime: 18.24, 
      actualTime: 19.00, 
      timeDifference: -0.76, 
      efficiency: '96%' 
    },
    { 
      date: new Date('2025-05-02'),
      machine: 'PCM-1 / 150T',
      shopFloor: 'production',
      department: 'tool_room',
      partDescription: 'LPG MT012 MIXING TUBE SMALL', 
      plannedQuantity: 6047, 
      actualQuantity: 5934, 
      rejectionQuantity: 0, 
      productionPercent: '98%', 
      actualManpowerUsed: 25, 
      requiredTime: 25.10, 
      actualTime: 25.25, 
      timeDifference: -0.15, 
      efficiency: '96%' 
    },
    { 
      date: new Date('2025-05-02'),
      machine: 'PCM-2 / 200T',
      shopFloor: 'pdc',
      department: 'maintenance',
      partDescription: 'SMART MIXING TUBE (SK) SMALL', 
      plannedQuantity: 32842, 
      actualQuantity: 32765, 
      rejectionQuantity: 0, 
      productionPercent: '100%', 
      actualManpowerUsed: 57, 
      requiredTime: 109.57, 
      actualTime: 119.25, 
      timeDifference: -9.68, 
      efficiency: '92%' 
    }
  ];
  
  constructor() {
    this.filteredData = [...this.operationData];
  }
  
  
  applyFilters() {
    this.filteredData = this.operationData.filter(item => {
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
    this.filteredData = [...this.operationData];
  }

  exportToExcel() {
    if (this.filteredData.length === 0) {
      console.warn('No data to export');
      return;
    }
  
    const formattedData = this.filteredData.map(item => ({
      'Date': this.formatDate(item.date),
      'Machine': item.machine,
      'Shop Floor': item.shopFloor,
      'Department': item.department,
      'Part Description': item.partDescription,
      'Planned Qty': item.plannedQuantity,
      'Actual Qty': item.actualQuantity,
      'Rejected Qty': item.rejectionQuantity,
      'Production %': item.productionPercent,
      'Manpower Used': item.actualManpowerUsed,
      'Required Time (hrs)': item.requiredTime,
      'Actual Time (hrs)': item.actualTime,
      'Time Difference (hrs)': item.timeDifference,
      'Efficiency': item.efficiency
    }));
  
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Production Data');
    
    const wscols = [
      {wch: 10},  
      {wch: 15},  
      {wch: 12},  
      {wch: 18},  
      {wch: 40},  
      {wch: 12},  
      {wch: 12},  
      {wch: 12},  
      {wch: 12},  
      {wch: 15},  
      {wch: 18},  
      {wch: 18},  
      {wch: 18},  
      {wch: 12}   
    ];
    worksheet['!cols'] = wscols;
    
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[-:T]/g, '');
    XLSX.writeFile(workbook, `Production_Data_${timestamp}.xlsx`);
  }
  
  exportToPDF() {
    if (this.filteredData.length === 0) {
      console.warn('No data to export');
      return;
    }
  
    try {
      const doc = new jsPDF('l', 'mm', 'a4');
  
      doc.setFontSize(18);
      doc.setTextColor(40);
      doc.setFont('helvetica', 'bold');
      doc.text('Production Efficiency Report', 14, 20);
  
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      const timestamp = new Date().toLocaleString();
      doc.text(`Generated on: ${timestamp}`, 14, 27);
  
      const headers = [
        ['Date', 'Machine', 'Shop Floor', 'Department', 'Part Description', 
         'Planned', 'Actual', 'Prod%', 'Manpower', 'Req Time', 'Act Time', 'Diff', 'Eff%']
      ];
  
      const data = this.filteredData.map(item => [
        this.formatDate(item.date),
        item.machine,
        item.shopFloor,
        item.department,
        item.partDescription.length > 20 ? 
          item.partDescription.substring(0, 17) + '...' : 
          item.partDescription,
        item.plannedQuantity.toString(),
        item.actualQuantity.toString(),
        item.productionPercent,
        item.actualManpowerUsed.toString(),
        item.requiredTime.toFixed(2),
        item.actualTime.toFixed(2),
        item.timeDifference.toFixed(2),
        item.efficiency
      ]);
  
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
          0: { cellWidth: 10, halign: 'center' },  
          1: { cellWidth: 15, halign: 'left' },    
          2: { cellWidth: 12, halign: 'left' },    
          3: { cellWidth: 15, halign: 'left' },    
          4: { cellWidth: 25, halign: 'left' },    
          5: { cellWidth: 10, halign: 'right' },   
          6: { cellWidth: 10, halign: 'right' },   
          7: { cellWidth: 8, halign: 'right' },    
          8: { cellWidth: 10, halign: 'right' },   
          9: { cellWidth: 10, halign: 'right' },   
          10: { cellWidth: 10, halign: 'right' },  
          11: { cellWidth: 8, halign: 'right' },   
          12: { cellWidth: 8, halign: 'right' }    
        },
        didDrawPage: (data) => {
          doc.setFontSize(8);
          doc.setTextColor(100);
          const pageCount = doc.getNumberOfPages();
          doc.text(`Page ${data.pageNumber} of ${pageCount}`, data.settings.margin.left, doc.internal.pageSize.height - 10);
        }
      });
  
      doc.save(`Production_Efficiency_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please check console for details.');
    }
  }

  private formatDate(date: Date): string {
    return date.toLocaleDateString('en-GB'); 
  }

}
