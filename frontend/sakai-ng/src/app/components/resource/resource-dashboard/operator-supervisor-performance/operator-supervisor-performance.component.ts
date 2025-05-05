import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
import { SplitButtonModule } from 'primeng/splitbutton';

import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

interface DropdownOption {
  label: string;
  value: any;
}

@Component({
  selector: 'app-operator-supervisor-performance',
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
  templateUrl: './operator-supervisor-performance.component.html',
  styleUrl: './operator-supervisor-performance.component.scss'
})
export class OperatorSupervisorPerformanceComponent implements OnInit {
  rangeDates = [];
  dateRanges: any[] = []; // This should contain your date range options if you have predefined ones
  selectedDate: any;
  filteredData = [];

  supervisors = [];



  supervisorList: DropdownOption[] = [];
  selectedSupervisor: DropdownOption;
  
  pluginDatalabels = pluginDatalabels;
  operatorList: DropdownOption[] = [];
  selectedOperator: DropdownOption;

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
  totalWorkingDays: number;
  totalPlanned: number;
  totalProduced: number;
  totalRejection: number;
  productionPercentage: string;
  rejectionPercentage: string;


  exportToExcel() {
    if (this.filteredData.length === 0) {
      console.warn('No production data to export');
      return;
    }
  
    // Format data for Excel
    const formattedData = this.filteredData.map(record => ({
      'Date': record.date.toLocaleDateString(),
      'Shift': record.shift,
      'Machine': record.machine,
      'Supervisor': record.supervisor,
      'Operator': record.operator,
      'Part': record.part,
      'Planned Qty': record.planned,
      'Produced Qty': record.produced,
      'Rejected Qty': record.rejection,
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
      {wch: 10},  // Shift
      {wch: 20},  // Machine
      {wch: 15},  // Supervisor
      {wch: 15},  // Operator
      {wch: 25},  // Part
      {wch: 12},  // Planned Qty
      {wch: 12},  // Produced Qty
      {wch: 12},  // Rejected Qty
      {wch: 12},  // Efficiency
      {wch: 12}   // Rejection Rate
    ];
    worksheet['!cols'] = wscols;
    
    // Generate Excel file with timestamp
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[-:T]/g, '');
    XLSX.writeFile(workbook, `Production_Data_${timestamp}.xlsx`);
  }
  
  exportToPDF() {
    if (this.filteredData.length === 0) {
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
        ['Date', 'Shift', 'Machine', 'Supervisor', 'Operator', 'Part', 
         'Planned', 'Produced', 'Rejected', 'Eff%', 'Rej%']
      ];
  
      const data = this.filteredData.map(record => [
        record.date.toLocaleDateString(),
        record.shift,
        record.machine,
        record.supervisor,
        record.operator,
        record.part,
        record.planned.toString(),
        record.produced.toString(),
        record.rejection.toString(),
        ((record.produced / record.planned) * 100).toFixed(2),
        ((record.rejection / record.produced) * 100).toFixed(2)
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
          0: { cellWidth: 12 },  // Date
          1: { cellWidth: 10 },  // Shift
          2: { cellWidth: 20 },  // Machine
          3: { cellWidth: 15 },  // Supervisor
          4: { cellWidth: 15 },  // Operator
          5: { cellWidth: 25 },  // Part
          6: { cellWidth: 12 },  // Planned
          7: { cellWidth: 12 },  // Produced
          8: { cellWidth: 12 },  // Rejected
          9: { cellWidth: 10 },  // Eff%
          10: { cellWidth: 10 }  // Rej%
        },
        didDrawPage: (data: any) => {
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

  ngOnInit(): void {
    // Initialize your data here
    this.initializeDateRanges();
    this.initializeSupervisors();
    this.initializeOperators();

    // // Set default selections as per your example
    // this.selectedDate = this.dateRanges[4];
    // this.selectedSupervisor = this.supervisorList[1];
    // this.selectedOperator = this.operatorList[1];
  }

  private initializeDateRanges(): void {
    // Example date ranges - adjust according to your needs
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    
    this.dateRanges = [
      { label: 'Today', value: [today, today] },
      { label: 'Yesterday', value: [yesterday, yesterday] },
      { label: 'Last 7 Days', value: [new Date(today.setDate(today.getDate() - 7)), today] },
      { label: 'Last 30 Days', value: [new Date(today.setDate(today.getDate() - 30)), today] },
      { label: 'This Month', value: [new Date(today.getFullYear(), today.getMonth(), 1), today] },
      { label: 'Last Month', value: [
        new Date(today.getFullYear(), today.getMonth() - 1, 1),
        new Date(today.getFullYear(), today.getMonth(), 0)
      ]}
    ];

    // Initialize rangeDates with the selected date range
    if (this.selectedDate) {  
      this.rangeDates = this.selectedDate.value;
    }
  }

  private initializeSupervisors(): void {
    // Example supervisor list - replace with your actual data
    this.supervisorList = [
      { label: 'John Smith', value: 'John Smith' },
      { label: 'Sarah Johnson', value: 'Sarah Johnson' },
      { label: 'Michael Brown', value: 'Michael Brown' }
    ];
  }

  private initializeOperators(): void {
    // Example operator list - replace with your actual data
    this.operatorList = [
      { label: 'Alex Wilson', value: 'Alex Wilson' },
      { label: 'Emily Davis', value: 'Emily Davis' },
      { label: 'Robert Taylor', value: 'Robert Taylor' }
    ];
  }


  chartData = {
    labels: ['July', 'October', 'September', 'November', 'August', 'December', 'null'],
    datasets: [
      {
        label: 'Production %',
        backgroundColor: '#42A5F5',
        data: [85, 81, 80, 80, 78, 78, 0]
      },
      {
        label: 'Rejection %',
        backgroundColor: '#EF5350',
        data: [5, 4, 5, 4, 3, 2, 0]
      }
    ]
  };

  chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#495057'
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: '#495057'
        },
        grid: {
          color: '#ebedef'
        }
      },
      y: {
        ticks: {
          color: '#495057'
        },
        grid: {
          color: '#ebedef'
        }
      }
    }
  };

  // supervisors = [
  //   { name: 'Sathish Ravi', production: '90%', rejection: '2%' },
  //   { name: 'Lakshmikanth', production: '87%', rejection: '2%' },
  //   { name: 'Dilip C', production: '82%', rejection: '1%' },
  //   { name: 'Umesh', production: '80%', rejection: '1%' }
  // ];

  productionData = [
    {
      date: new Date('2025-05-02'),
      shift: 'Shift1',
      machine: 'PCM-13 / 50T',
      supervisor: 'John Smith',
      operator: 'Alex Wilson',
      part: 'Ball Socket Assy S206',
      planned: 3000,
      produced: 2900,
      rejection: 100
    },
    {
      date: new Date('6-04-2024'),
      shift: 'Shift1',
      machine: 'PCM-14 / 50T',
      supervisor: 'Sarah Johnson',
      operator: 'Emily Davis',
      part: 'Ball Socket Assy S206',
      planned: 3001,
      produced: 2901,
      rejection: 101
    },
    {
      date: new Date('2025-05-01'),
      shift: 'Shift1',
      machine: 'PCM-15 / 50T',
      supervisor: 'Michael Brown',
      operator: 'Robert Taylor',
      part: 'Ball Socket Assy S206',
      planned: 3002,
      produced: 2902,
      rejection: 102
    },
    {
      date: new Date('6-06-2024'),
      shift: 'Shift1',
      machine: 'PCM-16 / 50T',
      supervisor: 'John Smith',
      operator: 'Alex Wilson',
      part: 'Ball Socket Assy S206',
      planned: 3003,
      produced: 2903,
      rejection: 103
    },
    {
      date: new Date('2025-05-01'),
      shift: 'Shift1',
      machine: 'PCM-17 / 50T',
      supervisor: 'Sarah Johnson',
      operator: 'Emily Davis',
      part: 'Ball Socket Assy S206',
      planned: 3004,
      produced: 2904,
      rejection: 104
    },
  ];

  constructor() {
    this.filteredData = [...this.productionData];

    this.supervisors = this.getSupervisorPerformanceMetrics();

    this.calculateProductionStats(this.filteredData);
  }
  
  calculateProductionStats(data: any[]) {
    // Reset all counters
    this.totalWorkingDays = 0;
    this.totalPlanned = 0;
    this.totalProduced = 0;
    this.totalRejection = 0;
    const uniqueDates = new Set<string>();
  
    // Calculate all values in one loop
    data.forEach(item => {
      this.totalPlanned += item.planned;
      this.totalProduced += item.produced;
      this.totalRejection += item.rejection;
      
      // Track unique dates (YYYY-MM-DD format)
      const dateKey = item.date.toISOString().split('T')[0];
      uniqueDates.add(dateKey);
    });
  
    // Set working days count
    this.totalWorkingDays = uniqueDates.size;
  
    // Calculate percentages
    this.productionPercentage = (this.totalProduced / this.totalPlanned * 100).toFixed(2) + '%';
    this.rejectionPercentage = (this.totalRejection / this.totalProduced * 100).toFixed(2) + '%';
  }
  getSupervisorPerformanceMetrics(): any[] {
    // Use filteredData instead of productionData
    const supervisorStats = new Map<string, { planned: number, produced: number, rejection: number }>();
  
    // Process each filtered record
    this.filteredData.forEach(record => {
      const { supervisor, planned, produced, rejection } = record;
      
      if (!supervisorStats.has(supervisor)) {
        supervisorStats.set(supervisor, { planned: 0, produced: 0, rejection: 0 });
      }
      
      const stats = supervisorStats.get(supervisor)!;
      stats.planned += planned;
      stats.produced += produced;
      stats.rejection += rejection;
    });
  
    return Array.from(supervisorStats).map(([name, stats]) => {
      const productionPercent = Math.round((stats.produced / stats.planned) * 100);
      const rejectionPercent = Math.round((stats.rejection / stats.produced) * 100);
      
      return {
        name,
        production: `${productionPercent}%`,
        rejection: `${rejectionPercent}%`,
        totalPlanned: stats.planned,
        totalProduced: stats.produced,
        totalRejection: stats.rejection
      };
    });
  }

  applyFilters() {
    this.filteredData = this.productionData.filter(item => {
      if (this.rangeDates && this.rangeDates[0] && this.rangeDates[1]) {
        const startDate = new Date(this.rangeDates[0]);
        const endDate = new Date(this.rangeDates[1]);
        endDate.setHours(23, 59, 59, 999); // Include entire end date
        
        const itemDate = new Date(item.date);
        if (itemDate < startDate || itemDate > endDate) {
          return false;
        }
      }

      // Supervisor filter
      if (this.selectedSupervisor && item.supervisor !== this.selectedSupervisor.value) {
        return false;
      }

      // Operator filter
      if (this.selectedOperator && item.operator !== this.selectedOperator.value) {
        return false;
      }

      return true;
    });
    this.supervisors = this.getSupervisorPerformanceMetrics();

    this.calculateProductionStats(this.filteredData);
  }

  resetFilters() {
    this.rangeDates = [];
    this.selectedSupervisor = null;
    this.selectedOperator = null;
    this.filteredData = [...this.productionData];
  }

}
