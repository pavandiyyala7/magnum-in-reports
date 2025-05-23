import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';
import { AuthService } from 'src/app/service/auth-service/auth.service';
import { MenuService } from './app.menu.service';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];

    constructor(public layoutService: LayoutService, private authService: AuthService,private menuService: MenuService) { }

    ngOnInit() {
        this.model = [
            {
                label: 'Home',
                items: [
                    { label: 'Home', icon: 'pi pi-fw pi-home', routerLink: ['/'] ,command: () => this.menuService.setActiveMenu('')},
                    { label: 'Shop Floor Performance', icon: 'pi pi-building', routerLink: ['/shopfloor_new'] ,command: () => this.menuService.setActiveMenu('Shop Floor') },
                    { label: 'LINE: SSL WORKSTATIONS', icon: 'pi pi-server', 
                      items: [
                        { label: 'Workstation - 001', icon: 'pi pi-cog', routerLink: ['/work_station1'] ,command: () => this.menuService.setActiveMenu('Line: SSL Workstation-001')},
                        { label: 'Workstation - 002', icon: 'pi pi-cog', routerLink: ['/work_station2'] },
                        { label: 'Workstation - 003', icon: 'pi pi-cog', routerLink: ['/work_station3'] },
                        { label: 'Workstation - 004', icon: 'pi pi-cog', routerLink: ['/work_station4'] },
                        { label: 'Workstation - 005', icon: 'pi pi-cog', routerLink: ['/work_station5'] },
                        { label: 'Workstation - 006', icon: 'pi pi-cog', routerLink: ['/work_station6'] },
                        { label: 'Workstation - 007', icon: 'pi pi-cog', routerLink: ['/work_station7'] },
                        { label: 'Workstation - 008', icon: 'pi pi-cog', routerLink: ['/work_station8'] },
                        { label: 'Workstation - 009', icon: 'pi pi-cog', routerLink: ['/work_station9'] },
                        { label: 'Workstation - 010', icon: 'pi pi-cog', routerLink: ['/work_station10'] },
                        { label: 'Workstation - 011', icon: 'pi pi-cog', routerLink: ['/work_station11'] },
                        { label: 'Workstation - 012', icon: 'pi pi-cog', routerLink: ['/work_station12'] },
                        
                      ] },
                ]
            },
            // {
            //     label: 'Resource Management',
            //     items: [
            //         {
            //             label: 'Resource Management', icon: 'fa-solid fa-user',
            //             items: [
            //                 {
            //                     label: 'Attendance Management', icon: 'fa-solid fa-calendar-days',
            //                     items: [
            //                         {
            //                             label: 'Dashboard', icon: 'fa-solid fa-tachometer',
            //                             items: [
            //                                 { label: 'Shift Strength V/S Skill Matrix', icon: 'fa-solid fa-scale-balanced', routerLink: ['/shift_skill'] },
            //                                 { label: 'Shift Strength', icon: 'fa-solid fa-users', routerLink: ['/shift_strength'] },
            //                                 { label: 'Evacuation', icon: 'fa-solid fa-right-from-bracket', routerLink: ['/evacuation'] },
            //                             ]
            //                         },
            //                         { label: 'Onboarding', icon: 'fa-solid fa-user-plus', routerLink: ['/employee_master'] },
            //                         {
            //                             label: 'Resource Allocation', icon: 'fa-solid fa-sliders',
            //                             items: [
            //                                 { label: 'Shift management', icon: 'fa-solid fa-list-check',  },
            //                                 { label: 'Reserve Skill Matrix Employee', icon: 'fa-solid fa-people-roof',  },
            //                             ]
            //                         },
            //                         {
            //                             label: 'Attendance Regularization', icon: 'fa-solid fa-people-roof',
            //                             items: [
            //                                 { label: 'Missed Punch Management', icon: 'fa-solid fa-fingerprint', routerLink: ['/missed_punch'] },
            //                                 { label: 'Leave Management', icon: 'fa-solid fa-calendar-days' },
            //                                 { label: 'Compensatory Off Management', icon: 'fa-solid fa-calendar-plus' },
            //                                 { label: 'On Duty Management', icon: 'fa-solid fa-calendar-minus' },
            //                                 { label: 'Gate Pass Management', icon: 'fa-solid fa-address-card' },
            //                                 { label: 'Holiday Management', icon: 'fa-solid fa-calendar-check' },
            //                             ]
            //                         }
            //                     ]
            //                 },
            //                 // {
            //                 //     label: 'Payroll Management', icon: 'fa-solid fa-money-check-dollar',
            //                 //     items: [
            //                 //         { label: 'Payroll Components', icon: 'fa-solid fa-coins' },
            //                 //         { label: 'CTC Details', icon: 'fa-solid fa-file-invoice-dollar' },
            //                 //         { label: 'Payroll Regulation', icon: 'fa-solid fa-scale-balanced' },
            //                 //         { label: 'Attendance Bonus', icon: 'fa-solid fa-calendar-check' },
            //                 //         { label: 'Yearly Bonus', icon: 'fa-solid fa-money-check' },
            //                 //         { label: 'Salary Advance', icon: 'fa-solid fa-money-bill-wave' },
            //                 //         { label: 'Monthly Attendance', icon: 'fa-solid fa-calendar-days' },
            //                 //     ]
            //                 // }
            //             ]
            //         }
            //     ]
            // },
            // {
            //     label: 'Utility Management',
            //     items: [
            //         {
            //             label: 'Utility Management', icon: 'fa-solid fa-briefcase',
            //             items: [
            //                 { label: 'Canteen Management', icon: 'fa-solid fa-utensils',
            //                     items: [
            //                         { label: 'Dashboard', icon: 'fa-solid fa-tachometer' },
            //                         { label: 'Food Counter Management', icon: 'fa-solid fa-utensils' },
            //                         { label: 'Food Allocation Managemen', icon: 'fa-solid fa-utensil-spoon' },
            //                         { label: 'Food Wallet Managemen', icon: 'fa-solid fa-wallet' },
            //                         { label: 'Food Menu Managemen', icon: 'fa-solid fa-list' },
            //                         // { label: 'Food Order', icon: 'fa-solid fa-cash-register' },
            //                         { label: 'Food Waste Managemen', icon: 'fa-solid fa-trash' },
            //                     ]
            //                 },
            //                 { label: 'Feedback Management', icon: 'fa-solid fa-comment-alt',
            //                     items: [
            //                         { label: 'Dashbaord', icon: 'fa-solid fa-tachometer' },
            //                         { label: 'Feedback Requests', icon: 'fa-solid fa-comment-alt' },
            //                         { label: 'Feedback Status Open/Close', icon: 'fa-solid fa-comment-alt' },
            //                         { label: 'Feedback Analysis', icon: 'fa-solid fa-chart-line' },
            //                     ]
            //                 },
            //                 { label: 'Gate Office Management', icon: 'fa-solid fa-building-lock',
            //                     items: [
            //                         { label: 'Dashboard', icon: 'fa-solid fa-tachometer' },
            //                         { label: 'Visitor Management', icon: 'fa-solid fa-user-check' },
            //                         { label: 'Material Management', icon: 'fa-solid fa-box' },
            //                         { label: 'Work Order Management', icon: 'fa-solid fa-clipboard-list' },
            //                         { label: 'Evacuation Management', icon: 'fa-solid fa-right-from-bracket' },
            //                         { label: 'Shift Strength Management', icon: 'fa-solid fa-users' },
            //                     ]
            //                 },
            //                 {
            //                     label: 'EHS Management', icon: 'fa-solid fa-shield-alt',
            //                     items: [
            //                         { label: 'Dashboard', icon: 'fa-solid fa-tachometer' },
            //                     ]
            //                 }
            //             ]
            //         }
            //     ]
            // },
            {
                label: 'Reports',
                items: [
                    {
                        label: 'Reports', icon: 'fa-solid fa-file',
                        items: [
                                    { label: 'Production Performance', icon: 'fa-solid fa-book', routerLink: ['/production_performance'] ,command: () => this.menuService.setActiveMenu('Production Performance')},
                                    { label: 'Operator VS Supervisor Performance', icon: 'fa-solid fa-book', routerLink: ['/operator_supervisor_performance'] ,command: () => this.menuService.setActiveMenu('Operator & Supervisor Performance')},
                                    { label: 'Sheduled VS Actual Performance', icon: 'fa-solid fa-book', routerLink: ['/sheduled_actual'] ,command: () => this.menuService.setActiveMenu('Sheduled VS Actual Report')},
                                    { label: 'Operation Plan Vs Actual PERFORMANCE', icon: 'fa-solid fa-book', routerLink: ['/operation_report'] ,command: () => this.menuService.setActiveMenu('Operation Report')},
                                    { label: 'Breakdown Analysis', icon: 'fa-solid fa-book', routerLink: ['/breakdown_report'] ,command: () => this.menuService.setActiveMenu('Breakdown Report')},
                                    { label: 'MTTR & MTBP Analysis', icon: 'fa-solid fa-book', routerLink: ['/mttr_mtbf'] ,command: () => this.menuService.setActiveMenu('MTTR MTBF')},
                                    { label: 'Quality Analysis', icon: 'fa-solid fa-book', routerLink: ['/quality_report'] ,command: () => this.menuService.setActiveMenu('Quality Report')},
                                    { label: 'OEE', icon: 'fa-solid fa-book', routerLink: ['/oee'] ,command: () => this.menuService.setActiveMenu('OEE')},

                            // {
                            //     label: 'Attendance Management', icon: 'fa-solid fa-calendar-days',
                            //     items: [
                            //         {
                            //             label: 'Daily Info', icon: 'fa-solid fa-calendar-days',
                            //             items: [
                            //                 { label: 'Daily Status', icon: 'fa-solid fa-chart-line', routerLink: ['/daily_report'] },
                            //                 { label: 'Mandays Report', icon: 'fa-solid fa-user-group', routerLink: ['/mandays_report'] },
                            //                 { label: 'Present Report', icon: 'fa-solid fa-user-check', routerLink: ['/present_report'] },
                            //                 { label: 'Absent Report', icon: 'fa-solid fa-user-times', routerLink: ['/absent_report'] },
                            //                 { label: 'Late Entry Report', icon: 'fa-solid fa-clock', routerLink: ['/late_entry_report'] },
                            //                 { label: 'Early Exit Report', icon: 'fa-solid fa-door-open', routerLink: ['/early_exit_report'] },
                            //                 { label: 'Overtime Report', icon: 'fa-solid fa-hourglass-half', routerLink: ['/overtime_report'] },
                            //                 { label: 'Missed Punch Report', icon: 'fa-solid fa-fingerprint', routerLink: ['/missed_punch_report'] },
                            //                 { label: 'Insufficient Hours Report', icon: 'fa-solid fa-clock', routerLink: ['/insufficient_hours_report'] },
                            //             ]
                            //         },
                            //         {
                            //             label: 'Monthly Info', icon: 'fa-solid fa-calendar',
                            //             items: [
                            //                 // { label: 'Monthly In - Out', icon: 'fa-solid fa-clock',  },
                            //                 { label: 'In – Out Register', icon: 'fa-solid fa-clock', routerLink: ['/Monthly_In_Out'] },
                            //                 { label: 'Duty Hours Register', icon: 'fa-solid fa-calendar-check', routerLink: ['/Monthly_Duty_Hours'] },
                            //                 { label: 'Muster Roll Register', icon: 'fa-solid fa-users' },
                            //                 { label: 'Payroll Output Register', icon: 'fa-solid fa-money-check' },
                            //                 { label: 'Shift Roaster Register', icon: 'fa-solid fa-users-cog' },
                            //                 { label: 'Overtime Register', icon: 'fa-solid fa-clock' },
                            //                 { label: 'Late Entry Register', icon: 'fa-solid fa-door-closed' },
                            //                 { label: 'Early Exit Register', icon: 'fa-solid fa-door-open' },
                            //                 { label: 'Absent Register', icon: 'fa-solid fa-times-circle' },
                            //                 { label: 'Present Register', icon: 'fa-solid fa-check-circle' },
                            //             ]
                            //         },
                            //         { label: 'Device Logs', icon: 'fa-solid fa-fingerprint', routerLink: ['/logs'] },
                            //     ]
                            // },
                            // {
                            //     label: 'Payroll Management', icon: 'fa-solid fa-money-check-dollar',
                            //     items: [
                            //         { label: 'New Joining Register', icon: 'fa-solid fa-user-plus' },
                            //         { label: 'Adult Register', icon: 'fa-solid fa-user-tie' },
                            //         { label: 'Holiday Register', icon: 'fa-solid fa-umbrella-beach' },
                            //         { label: 'Man-days Register', icon: 'fa-solid fa-user-group' },
                            //         { label: 'Attendance', icon: 'fa-solid fa-calendar-check' },
                            //         { label: 'Salary Statement', icon: 'fa-solid fa-file-invoice-dollar' },
                            //         { label: 'Salary Abstract', icon: 'fa-solid fa-file-contract' },
                            //         { label: 'Bank Statement', icon: 'fa-solid fa-building-columns' },
                            //         { label: 'PF Statement', icon: 'fa-solid fa-piggy-bank' },
                            //         { label: 'ESI Statement', icon: 'fa-solid fa-hospital' },
                            //         { label: 'PT Statement', icon: 'fa-solid fa-receipt' },
                            //         { label: 'Payslip', icon: 'fa-solid fa-file-invoice' },
                            //     ]
                            // },
                            // {
                            //     label: 'Canteen Management', icon: 'fa-solid fa-utensils',
                            //     items: [
                            //         { label: 'Food Order Report', icon: 'fa-solid fa-cash-register' },
                            //         { label: 'Food Wallet Report', icon: 'fa-solid fa-wallet' },
                            //         { label: 'Food Waste Report', icon: 'fa-solid fa-trash' },
                            //     ]
                            // },
                            // {
                            //     label: 'Feedback Management', icon: 'fa-solid fa-comment-alt',
                            //     items: [
                            //         { label: 'Feedback Report', icon: 'fa-solid fa-comment-alt' },
                            //         { label: 'Feedback Analysis Report', icon: 'fa-solid fa-chart-line' },
                            //     ]
                            // },
                            // {
                            //     label: 'Gate Office Management', icon: 'fa-solid fa-building-lock',
                            //     items: [
                            //         { label: 'Visitor Management Report', icon: 'fa-solid fa-user-check' },
                            //         { label: 'Material Management Report', icon: 'fa-solid fa-box' },
                            //         { label: 'Work Order Management Report', icon: 'fa-solid fa-clipboard-list' },
                            //         { label: 'Evacuation Management Report', icon: 'fa-solid fa-right-from-bracket' },
                            //         { label: 'Shift Strength Management Report', icon: 'fa-solid fa-users' },
                            //     ]
                            // },
                            // {
                            //     label: 'EHS Management', icon: 'fa-solid fa-shield-alt',
                            //     items: [
                            //         { label: 'EHS Report', icon: 'fa-solid fa-shield-alt' },
                            //     ]
                            // }
                        ]
                    }
                ]
            },

            // {
            //     label: 'Settings',
            //     items: [
            //         {
            //             label: 'Settings', icon: 'fa-solid fa-gear',
            //             items: [
            //                 { label: 'Configuration', icon: 'fa-solid fa-cogs', routerLink: ['/configuration'] },
            //             ]
            //         }
            //     ]
            // },

            {
                label: 'Profile',
                items: [
                    { label: 'Profile', icon: 'fa-solid fa-user',
                        items: [
                            { label: 'Account', icon: 'fa-solid fa-user-circle' },
                            { label: 'Logout', icon: 'fa-solid fa-sign-out-alt', command: () => { this.authService.logout(); } }
                        ]
                    },
                ]
            }
        ];
    }
}
