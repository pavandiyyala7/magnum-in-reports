import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { SplitButtonModule } from 'primeng/splitbutton';
import { TableModule } from 'primeng/table';
import { CalendarModule } from 'primeng/calendar';

import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-pdc',
  standalone: true,
  imports: [
    FormsModule,
    ChartModule,
    TableModule,
    CardModule,
    InputTextModule,
    DropdownModule,
    SplitButtonModule, CalendarModule
  ],
  templateUrl: './pdc.component.html',
  styleUrl: './pdc.component.scss'
})
export class PDCComponent implements OnInit  {
  
  lastUpdated = new Date();
  rangeDates: Date[] | undefined;
  selectedMachine: any ;
  selectedShopfloor: any ;
  selectedDepartment: any ;

  departmentOptions = [
    { label: 'PDC', value: 'PDC' },
    { label: 'Production', value: 'PRODUCTION' },
    { label: 'Quality', value: 'QUALITY' },
    { label: 'Maintenance', value: 'MAINTENANCE' }
  ];

  // Unit options organized by department
  allUnits = {
    'PDC': [
      { label: 'UNIT-01', value: 'UNIT-01' },
      { label: 'UNIT-02', value: 'UNIT-02' },
      { label: 'UNIT-03', value: 'UNIT-03' }
    ],
    'PRODUCTION': [
      { label: 'PROD-01', value: 'PROD-01' },
      { label: 'PROD-02', value: 'PROD-02' }
    ],
    'QUALITY': [
      { label: 'QC-01', value: 'QC-01' },
      { label: 'QC-02', value: 'QC-02' }
    ],
    'MAINTENANCE': [
      { label: 'MNT-01', value: 'MNT-01' },
      { label: 'MNT-02', value: 'MNT-02' }
    ]
  };

  // Machine options organized by unit
  allMachines = {
    'UNIT-01': [
      { label: 'Machine A', value: 'MACHINE-A' },
      { label: 'Machine B', value: 'MACHINE-B' }
    ],
    'UNIT-02': [
      { label: 'Machine X', value: 'MACHINE-X' },
      { label: 'Machine Y', value: 'MACHINE-Y' }
    ],
    'UNIT-03': [
      { label: 'Machine P', value: 'MACHINE-P' },
      { label: 'Machine Q', value: 'MACHINE-Q' }
    ]
  };

  // Current selections
  selectedUnit: string;

  // Filtered options
  unitOptions: any[] = [];
  machineOptions: any[] = [];

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
    { label: 'Maintenance', value: 'maintenance', shopFloor: 'pdc' },
    { label: 'Tool Room', value: 'tool_room', shopFloor: 'pdc' },
    { label: 'Process Engineering', value: 'process_engineering', shopFloor: 'qa' }
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

  applyFilters(){
    console.log('filters is triggered')
  }

  ngOnInit() {
    // Initialize with default values
    this.selectedDepartment = 'PDC';
    this.onDepartmentChange();
    
    // If you want to preselect a unit as well:
    // this.selectedUnit = 'UNIT-01';
    // this.onUnitChange();
  }

  
  onDepartmentChange() {
    // Reset dependent selections
    this.selectedUnit = null;
    this.selectedMachine = null;
    this.machineOptions = [];
    
    // Filter units based on selected department
    this.unitOptions = this.allUnits[this.selectedDepartment] || [];
  }

  onUnitChange() {
    // Reset machine selection
    this.selectedMachine = null;
    
    // Filter machines based on selected unit
    this.machineOptions = this.allMachines[this.selectedUnit] || [];
  }

  oeeData = {
    labels: ['120T III', '120T IV', '120T V', '180T', '250T-I', '250T-II', '400T I', '400T II', '650T'],
    datasets: [
      {
        label: 'OEE',
        backgroundColor: '#FF9800',
        data: [0, 0, 0, 37, 37, 35, 72, 64, 64, 82]
      },
      {
        label: 'Target',
        backgroundColor: '#90CAF9',
        data: [100, 100, 100, 100, 100, 100, 100, 100, 100]
      }
    ]
  };

  planVsActualData = {
    labels: ['120T III', '120T IV', '120T V', '180T', '250T-I', '250T-II', '400T I', '400T II', '650T'],
    datasets: [
      {
        label: 'Plan vs Actual',
        backgroundColor: '#66BB6A',
        data: [0, 0, 0, 50, 46, 45, 81, 76, 79, 95]
      },
      {
        label: 'Target',
        backgroundColor: '#29B6F6',
        data: [100, 100, 100, 100, 100, 100, 100, 100, 100]
      }
    ]
  };

  pieData = {
    labels: [
      'Machine Breakdown', 'Die/Tool Breakdown', 'Furnace Problem',
      'Pin Issue/Core Leakage', 'Core Pin-Ejection', 'Metal Delay',
      'Die Setup Time', 'Others'
    ],
    datasets: [
      {
        data: [61, 15, 0, 5, 2, 14, 4, 0],
        backgroundColor: [
          '#FF7043', '#FFB300', '#8D6E63', '#81C784', '#64B5F6', '#BA68C8', '#FFD54F', '#90A4AE'
        ]
      }
    ]
  };

  lossReasons = [
    { reason: 'No Raw Material', time: 0 },
    { reason: 'Machine Breakdown', time: 130 },
    { reason: 'Furnace Problem', time: 0 },
    { reason: 'Die/Tool Breakdown', time: 33 },
    { reason: 'Core Pin-Ejection', time: 4 },
    { reason: 'Pin Issue/Core Leakage', time: 11 },
    { reason: 'Die Setup Time', time: 9 },
    { reason: 'Metal Delay', time: 14 },
    { reason: 'Die Coat Filling', time: 0 },
    { reason: 'Plunger Change Time', time: 1 },
    { reason: 'Degassing Time', time: 12 },
    { reason: 'No Power', time: 1 },
    { reason: 'Ladle Cup Issue', time: 0 },
    { reason: 'No Water', time: 0 },
    { reason: 'No Air', time: 0 },
    { reason: 'Vehicle Loading/Unloading', time: 0 },
    { reason: 'Operator Missing', time: 0 },
    { reason: 'Casting Jam', time: 0 },
  ];

  totalTime = 215;
  machineUtilization = '89%';
  availableHours = 600;
  plannedHours = 534;

  machineData = [
    { machine: 'PCM-16/25T', availability: 45.43, performance: 45.43, quality: 98.39, oee: 20.11, downtime: 1223 },
    { machine: 'PCM-1 / 150T', availability: 70.77, performance: 69.65, quality: 98.57, oee: 48.75, downtime: 676.3 },
    { machine: 'PCM-1 / 150T', availability: 69.65, performance: 65.31, quality: 99.11, oee: 44.85, downtime: 563.4 },
    { machine: 'PCM-41/50T', availability: 91.95, performance: 92.31, quality: 97.85, oee: 82.75, downtime: 58.5 },
    { machine: 'PCM-140/150T', availability: 67.11, performance: 77.53, quality: 92.65, oee: 48.01, downtime: 493.1 },
    { machine: 'PCM-50/60T', availability: 88.53, performance: 87.93, quality: 90.45, oee: 70.32, downtime: 482.9 },
    { machine: 'PCM-403/100T', availability: 79.39, performance: 77.39, quality: 91.65, oee: 56.16, downtime: 491.6 },
    { machine: 'PCM-410/130T', availability: 75.57, performance: 71.87, quality: 90.12, oee: 48.81, downtime: 318.3 },
    { machine: 'PCM-409/150T', availability: 75.27, performance: 78.53, quality: 92.19, oee: 54.31, downtime: 316.3 },
    { machine: 'PCM-404/80T', availability: 77.19, performance: 74.71, quality: 91.27, oee: 52.74, downtime: 263.1 },
    { machine: 'PCM-407/90T', availability: 91.32, performance: 89.32, quality: 90.65, oee: 73.89, downtime: 213.2 },
    { machine: 'PCM-405/90T', availability: 93.25, performance: 89.99, quality: 88.85, oee: 74.20, downtime: 197.1 },
    { machine: 'PCM-406/80T', availability: 91.89, performance: 91.79, quality: 89.95, oee: 75.52, downtime: 189.2 },
    { machine: 'PCM-2 / 200T', availability: 95.25, performance: 93.65, quality: 92.85, oee: 82.85, downtime: 164.5 },
    { machine: 'PCM-102/100T', availability: 90.45, performance: 91.15, quality: 87.65, oee: 72.12, downtime: 155.7 },
    { machine: 'PCM-402/60T', availability: 92.75, performance: 91.55, quality: 88.55, oee: 74.51, downtime: 148.7 },
    { machine: 'PCM-4 / 300T', availability: 89.35, performance: 87.95, quality: 89.95, oee: 70.43, downtime: 142.1 },
    { machine: 'PCM-3 / 250T', availability: 95.89, performance: 93.25, quality: 90.85, oee: 81.12, downtime: 126.3 },
    { machine: 'PCM-403/90T', availability: 93.55, performance: 92.45, quality: 88.15, oee: 76.41, downtime: 117.2 },
    { machine: 'PCM-419/450T', availability: 57.14, performance: 65.71, quality: 81.65, oee: 36.25, downtime: 533.5 }
  ];
  
}