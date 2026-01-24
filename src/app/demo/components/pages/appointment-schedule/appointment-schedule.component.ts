import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import {FormBuilder,FormGroup,FormControl,Validators} from '@angular/forms';
import { Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MessageServiceService } from 'src/app/services/message-service/message-service.service';
import { AppointmentSchedulingServiceService } from 'src/app/services/appointment_scheduling/appointment-scheduling-service.service';
import { ClientRegServiceService } from 'src/app/services/client-reg/client-reg-service.service';
import { EmployeeRegServicesService } from 'src/app/services/employee-reg/employee-reg-services.service';
import { MatSort } from '@angular/material/sort';
import { ServiceService } from 'src/app/services/service/service.service';

@Component({
    selector: 'app-appointment-schedule',
    templateUrl: './appointment-schedule.component.html',
    styleUrls: ['./appointment-schedule.component.scss']
})
export class AppointmentScheduleComponent implements OnInit, OnDestroy {
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    
    appointmentScheduleForm: FormGroup;
    dataSource = new MatTableDataSource<any>([]);
    clients: any[] = [];
    stylists: any[] = [];
    services: any[] = [];

    // appointment status options
    appointmentStatuses: {value: string, viewValue: string}[] = [
        {value: 'BOOKED', viewValue: 'Booked'},
        {value: 'CONFIRMED', viewValue: 'Confirmed'},
        {value: 'CHECKED_IN', viewValue: 'Checked In'},
        {value: 'IN_PROGRESS', viewValue: 'In Progress'},
        {value: 'COMPLETED', viewValue: 'Completed'},
        {value: 'CANCELLED', viewValue: 'Cancelled'},
        {value: 'NO_SHOW', viewValue: 'No Show'}
    ];

    //bookingSource options
    bookingSources: {value: string, viewValue: string}[] = [
        {value: 'ONLINE', viewValue: 'Online'},
        {value: 'PHONE', viewValue: 'Phone'},
        {value: 'WALK_IN', viewValue: 'Walk-in'}
    ];

    displayedColumns: string[] = [
        'clientName',
        'stylistName',
        'serviceName',
        'appointmentDate',
        'appointmentStartTime',
        'appointmentEndTime',
        'appointmentStatus',
        'bookingSource',
        'notes',
        'cancellationReason',
        'actions',
    ];
    
    //state
    isButtonDisabled = false;
    submitted = false;
    saveButtonLabel = 'Save';
    mode: 'add' | 'edit' = 'add';
    selectedData: any = null;
    selectedRow: any = null;
    lastAddedRow: any = null;
    lastEditedRow: any = null;

    // end time auto-calculation tracking
    private endTimeAutoCalculated = true;
    private subs: Subscription[] = [];

    constructor(
        private fb: FormBuilder,
        private appointmentScheduleService: AppointmentSchedulingServiceService,
        private messageService: MessageServiceService,
        private clientRegService: ClientRegServiceService,
        private employeeRegServices: EmployeeRegServicesService,
        private serviceService: ServiceService
    ) {
        this.appointmentScheduleForm = this.fb.group({
            clientId: [null, [Validators.required]],
            stylistId: [null, [Validators.required]],
            serviceId: [null, [Validators.required]],
            appointmentDate: [null, [Validators.required]],
            appointmentStartTime: [null, [Validators.required]],
            appointmentEndTime: [null, [Validators.required]],
            appointmentStatus: ['BOOKED', [Validators.required]],
            bookingSource: [null, [Validators.required]],
            notes: [null],
        });
  }

    ngOnInit(): void {
        this.loadClients();
        this.loadStylists();
        this.loadServices();
        this.populateData();

        // auto-calc end time when start time or selected service changes
        const startCtrl = this.appointmentScheduleForm.get('appointmentStartTime');
        const serviceCtrl = this.appointmentScheduleForm.get('serviceId');
        const endCtrl = this.appointmentScheduleForm.get('appointmentEndTime');

        //if the start time changes, check compute end time
        if (startCtrl) {
            this.subs.push(startCtrl.valueChanges.subscribe(() => this.computeEndTimeIfNeeded()));
        }
        //if the service changes, check compute end time
        if (serviceCtrl) {
            this.subs.push(serviceCtrl.valueChanges.subscribe(() => this.computeEndTimeIfNeeded()));
        }
        if (endCtrl) {
            // if user edits end time manually, prevent overriding by auto-calculation
            this.subs.push(endCtrl.valueChanges.subscribe(() => this.endTimeAutoCalculated = false));
        }
    }

    populateData(): void {
            this.appointmentScheduleService.getData().subscribe({
            next: (response: any[]) => {
                this.dataSource = new MatTableDataSource(response || []);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
            },
            error: (error) => {
                this.messageService.showError('Error fetching data: ' + error.message);
            }
        });
    }

    //Calls client reg service's getData() to get clients
    loadClients(): void {
        this.clientRegService.getData().subscribe({
            next: (response: any[]) => {
                //stores the received data in "clients" array
                this.clients = response || [];
            },
            error: (error) => {
                this.messageService.showError('Error fetching clients: ' + error.message);
            }
        });
    }

    //Calls employee reg service's getData() to get stylists
    loadStylists(): void {
        this.employeeRegServices.getData().subscribe({
            next: (response: any[]) => {
                //stores the received data in "stylists" array
                this.stylists = response || [];
            },
            error: (error) => {
                this.messageService.showError('Error fetching stylists: ' + error.message);
            }
        });
    }

    //Calls service service's getData() to get services
    loadServices(): void {
        this.serviceService.getData().subscribe({
            next: (response: any[]) => {
                //stores the received data in "services" array
                this.services = response || [];
            },
            error: (error) => {
                this.messageService.showError('Error fetching services: ' + error.message);
            }
        });
    }

  onSubmit(): void {
        this.submitted = true;
        if (this.appointmentScheduleForm.invalid) return;

        this.isButtonDisabled = true;
        const formValue = this.appointmentScheduleForm.value;

        if (this.mode === 'add') {
            this.appointmentScheduleService.serviceCall(formValue).subscribe({
                next: (response) => {
                    this.dataSource.data = [response, ...this.dataSource.data];
                    this.messageService.showSuccess('Saved Successfully!');
                    this.highlightRow('add', response);
                    this.resetFormState();
                },
                error: (error) => this.handleError(error)
            });
        } else {
            this.appointmentScheduleService.editData(this.selectedData?.id, formValue).subscribe({
                next: (response) => {
                    const index = this.dataSource.data.findIndex(item => item.id === this.selectedData?.id);
                    if (index > -1) this.dataSource.data[index] = response;
                    this.messageService.showSuccess('Updated Successfully!');
                    this.highlightRow('edit', response);
                    this.resetFormState();
                },
                error: (error) => this.handleError(error)
            });
        }
    }

 editData(data: any): void {
        const patchVal: any = { ...data };
        patchVal.clientId = data.clientId ?? data.client?.id ?? null;
        patchVal.appointmentDate = data.appointmentDate ? new Date(data.appointmentDate) : null;
        patchVal.appointmentStartTime = data.appointmentStartTime ?? null;
        patchVal.appointmentEndTime = data.appointmentEndTime ?? null;
        patchVal.appointmentStatus = data.appointmentStatus ?? data.status ?? 'BOOKED';
        patchVal.bookingSource = data.bookingSource ?? null;
        patchVal.notes = data.notes ?? null;
        this.appointmentScheduleForm.patchValue(patchVal);
        this.selectedData = data;
        this.saveButtonLabel = 'Update';
        this.mode = 'edit';
        this.isButtonDisabled = false;
        this.selectedRow = data;

        // if end time missing, compute it from start time + service duration
        if (!patchVal.appointmentEndTime) {
            this.computeEndTimeIfNeeded();
        }
    }

    deleteData(data: any): void {
        this.appointmentScheduleService.deleteData(data.id).subscribe({
            next: () => {
                this.messageService.showSuccess('Deleted Successfully!');
                this.populateData();
            },
            error: (error) => this.messageService.showError('Delete failed: ' + error.message)
        });
    }

    applyFilter(event: Event): void {
        const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
        this.dataSource.filter = filterValue;
        if (this.dataSource.paginator) this.dataSource.paginator.firstPage();
    }

    refreshData(): void {
        this.populateData();
        this.dataSource.filter = '';
        this.selectedRow = null;
        if (this.dataSource.paginator) this.dataSource.paginator.firstPage();
    }

    resetData(): void {
        // set default status to BOOKED when resetting
        this.appointmentScheduleForm.reset({ appointmentStatus: 'BOOKED' });
        this.appointmentScheduleForm.enable();
        this.submitted = false;
        this.saveButtonLabel = 'Save';
        this.mode = 'add';
        this.isButtonDisabled = false;
        this.endTimeAutoCalculated = true;
    }

    // compute end time helper methods
    //this method deciedes whether to compute end time or not
    private computeEndTimeIfNeeded(): void {
        //get the appointment Start Time value and store it in "start" variable. If there's no value (start time is not given),do nothing and return
        const start = this.appointmentScheduleForm.get('appointmentStartTime')?.value;
        if (!start) return;
        //get the appointment End Time form control and store it in "endCtrl" variable. If there's no such control, do nothing and return
        const endCtrl = this.appointmentScheduleForm.get('appointmentEndTime');
        if (!endCtrl) return;
        //If end time already has a value and it was not auto-calculated, do nothing and return
        if (endCtrl.value && !this.endTimeAutoCalculated) return; // user edited end time, don't override

        //figure out which service is selected and send to computeEndTime to get the calculated end time
        const serviceCtrlVal = this.appointmentScheduleForm.get('serviceId')?.value ?? this.selectedData?.serviceId ?? this.selectedData?.service?.id;
        const end = this.computeEndTime(start, serviceCtrlVal);
        if (end) {
            //set the end time and prevent triggering valueChanges event to avoid loop
            this.endTimeAutoCalculated = true;
            endCtrl.setValue(end, { emitEvent: false });
        }
    }

    //computEndTime method
    private computeEndTime(startTime: string, serviceId: any): string | null {
        if (!startTime) return null;
        const durationMinutes = this.getServiceDuration(serviceId);
        // use appointmentDate if present for correct day rollovers
        const dateBase = this.appointmentScheduleForm.get('appointmentDate')?.value ? new Date(this.appointmentScheduleForm.get('appointmentDate')!.value) : new Date();
        const parts = startTime.split(':').map(p => Number(p));
        if (parts.length < 2 || isNaN(parts[0]) || isNaN(parts[1])) return null;
        dateBase.setHours(parts[0], parts[1], 0, 0);
        const endDate = new Date(dateBase.getTime() + durationMinutes * 60000);
        const hh = String(endDate.getHours()).padStart(2, '0');
        const mm = String(endDate.getMinutes()).padStart(2, '0');
        return `${hh}:${mm}`;
    }
    
    //how long is the service duration
    private getServiceDuration(serviceId: any): number {
        //if the srevice has a duration, use it. otherwise default to 30 minutes
        const s = this.services.find(x => x.id === serviceId) || (this.selectedData && this.selectedData.service && this.selectedData.service.id === serviceId ? this.selectedData.service : null);
        let duration = s?.duration ?? 30;
        if (typeof duration !== 'number') duration = Number(duration) || 30;
        return duration;
    }

    //quit subscriptions. (startCtrl, serviceCtrl, endCtrl -'cause subscriptions do not end automatically)
    ngOnDestroy(): void {
        this.subs.forEach(s => s.unsubscribe());
    }

    // helpers
    private handleError(error: any): void {
        this.messageService.showError('Action failed: ' + error.message);
        this.isButtonDisabled = false;
    }
    
     private highlightRow(type: 'add' | 'edit', response: any): void {
        if (type === 'add') this.lastAddedRow = response;
        else this.lastEditedRow = response;
        setTimeout(() => {
            this.lastAddedRow = null;
            this.lastEditedRow = null;
        }, 3000);
        }

    private resetFormState(): void {
        this.resetData();
        this.isButtonDisabled = false;
        this.populateData();
    
    }
}
