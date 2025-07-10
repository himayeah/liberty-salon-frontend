import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { InventoryServiceService } from 'src/app/services/inventory/inventory-service.service';
import { MessageServiceService } from 'src/app/services/message-service/message-service.service';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent implements OnInit {

  inventoryForm: FormGroup;
  displayedColumns: string[] = [
    'productName', 'productCategory', 'supplier', 'productQty',
    'purchasePrice', 'sellingPrice', 'expiryDate', 'productStatus', 'actions'
  ];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  mode = 'add';
  selectedData: any;
  submitted = false;
  isButtonDisabled = false;

  constructor(
    private fb: FormBuilder,
    private inventoryService: InventoryServiceService,
    private messageService: MessageServiceService
  ) {
    this.inventoryForm = this.fb.group({
      productName: new FormControl('', [Validators.required]),
      productCategory: new FormControl('', [Validators.required]),
      supplier: new FormControl('', [Validators.required]),
      productQty: new FormControl('', [Validators.required]),
      purchasePrice: new FormControl('', [Validators.required]),
      sellingPrice: new FormControl('', [Validators.required]),
      expiryDate: new FormControl('', [Validators.required]),
      productStatus: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.populateData();
  }

  populateData(): void {
    try {
      this.inventoryService.getData().subscribe((response: any[]) => {
        console.log("get Data response", response);

        if (response && response.length > 0) {
          this.dataSource = new MatTableDataSource(response);
          this.dataSource.paginator = this.paginator;
        }
      }, error => {
        console.error("Error fetching data", error);
      });
    } catch (error) {
      this.messageService.showError('Action failed with error ' + error);
    }
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.inventoryForm.invalid) return;

    const formValue = this.inventoryForm.value;
    this.isButtonDisabled = true;

    if (this.mode === 'add') {
      this.inventoryService.serviceCall(formValue).subscribe(() => {
        this.messageService.showSuccess('Data added successfully!');
        this.populateData();
        this.resetForm();
      }, () => {
        this.isButtonDisabled = false;
      });
    } else if (this.mode === 'edit') {
      this.inventoryService.editData(this.selectedData.id, formValue).subscribe(() => {
        this.messageService.showSuccess('Data updated successfully!');
        this.populateData();
        this.resetForm();
      }, () => {
        this.isButtonDisabled = false;
      });
    }
  }

  resetForm(): void {
    this.inventoryForm.reset();
    this.mode = 'add';
    this.selectedData = null;
    this.submitted = false;
    this.isButtonDisabled = false;
    this.inventoryForm.enable();
  }

  editData(data: any): void {
    this.inventoryForm.patchValue({
      productName: data.productName,
      productCategory: data.productCategory,
      supplier: data.supplier,
      productQty: data.productQty,
      purchasePrice: data.purchasePrice,
      sellingPrice: data.sellingPrice,
      expiryDate: data.expiryDate,
      productStatus: data.productStatus,
    });
    this.selectedData = data;
    this.mode = 'edit';
    this.inventoryForm.enable();
    this.isButtonDisabled = false;
  }

  deleteData(data: any): void {
    try {
      const id = data.id;
      this.inventoryService.deleteData(id).subscribe(() => {
        this.messageService.showSuccess('Data deleted successfully');
        this.populateData();
      });
    } catch (error) {
      console.log(error);
      this.messageService.showError('Action failed with error ' + error);
    }
  }
}



