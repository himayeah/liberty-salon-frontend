import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MessageServiceService } from 'src/app/services/message-service/message-service.service';
import { AppointmentSchedulingServiceService } from 'src/app/services/appointment_scheduling/appointment-scheduling-service.service';

@Component({
  selector: 'app-appointment-schedule',
  standalone: false,
  templateUrl: './appointment-schedule.component.html',
})
export class AppointmentScheduleComponent implements OnInit {

  appointmentScheduleForm: FormGroup;
  displayedColumns: string[] = ['serviceName', 'serviceDescription', 'serviceDate', 'serviceTime', 'actions'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  mode = 'add';
  selectedData: any;
  isButtonDisabled = false;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private appointmentScheduleService: AppointmentSchedulingServiceService,
    private messageService: MessageServiceService
  ) {
    this.appointmentScheduleForm = this.fb.group({
      serviceName: new FormControl('', [Validators.required]),
      serviceDescription: new FormControl('', [Validators.required]),
      serviceDate: new FormControl('', [Validators.required]),
      serviceTime: new FormControl('', [Validators.required]),
    });

    this.dataSource = new MatTableDataSource([
      { serviceName: 'Consultation', serviceDescription: 'Initial consult', serviceDate: '2025-07-01', serviceTime: '10:00 AM' }
    ]);
  }

  ngOnInit(): void {
    this.populateData();
  }

  public populateData(): void {
    try {
      this.appointmentScheduleService.getData().subscribe((response: any[]) => {
        console.log("get Data response", response);

        if (response && response.length > 0) {
          this.dataSource = new MatTableDataSource(response);
          this.dataSource.paginator = this.paginator;
        }
      }, error => {
        console.error("Error fetching data", error);
        this.messageService.showError('Failed to load appointments: ' + error);
      });
    } catch (error) {
      this.messageService.showError('Action failed with error: ' + error);
    }
  }

  onSubmit(): void {
    try {
      console.log("Form Submitted");
      console.log(this.appointmentScheduleForm.value);

      this.submitted = true;

      if (this.appointmentScheduleForm.invalid) {
        return;
      }

      if (this.mode === 'add') {
        this.appointmentScheduleService.serviceCall(this.appointmentScheduleForm.value).subscribe(response => {
          console.log('server response:', response);
          this.populateData(); 
          this.messageService.showSuccess('Appointment added successfully!');
        });
      } else if (this.mode === 'edit') {
        this.appointmentScheduleService.editData(this.selectedData.id, this.appointmentScheduleForm.value).subscribe(response => {
          console.log('server response for edit:', response);
          this.populateData(); 
          this.messageService.showSuccess('Appointment updated successfully!');
        });
      }

      this.mode = 'add';
      this.appointmentScheduleForm.disable();
      this.isButtonDisabled = true;

    } catch (error) {
      this.messageService.showError('Action failed with error: ' + error);
    }
  }

  public resetData(): void {
    this.appointmentScheduleForm.reset();
    this.appointmentScheduleForm.enable();
    this.isButtonDisabled = false;
    this.submitted = false;
  }

  public editData(data: any): void {
    this.appointmentScheduleForm.patchValue(data);
    this.appointmentScheduleForm.enable();
    this.mode = 'edit';
    this.selectedData = data;
    this.isButtonDisabled = false;
  }

  public deleteData(data: any): void {
    try {
      const id = data.id;
      this.appointmentScheduleService.deleteData(id).subscribe(response => {
        console.log('server response for delete:', response);
        this.populateData();
        this.messageService.showSuccess('Appointment deleted successfully!');
      });
    } catch (error) {
      console.log(error);
      this.messageService.showError('Delete failed: ' + error);
    }
  }
}
