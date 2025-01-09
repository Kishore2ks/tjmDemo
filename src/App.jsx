import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ProductService } from './service/ProductService';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { FileUpload } from 'primereact/fileupload';

export default function GridLinesDemo() {
  const [products, setProducts] = useState([]);
  const [expandedRows, setExpandedRows] = useState(null);

  const DocumentType = [
    { name: '10th mark sheet', id: '1' },
    { name: '12th mark sheet', id: '2' },
    { name: 'PAN', id: '3' },
    { name: 'Aadhar', id: '4' },
    { name: 'Driving Licence', id: '5' }
  ];

  const updateRowData = (id, updates) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === id ? { ...product, ...updates } : product
      )
    );
  };

  const RowDropDown = ({ rowsData }) => {
    const onValueChange = (e) => {
      // setSelectedDocument(e.value);
      updateRowData(rowsData?.id, { selectedDocument: e.value });
    };

    return (
      <Dropdown
        value={rowsData?.selectedDocument || null}
        onChange={(e) => onValueChange(e)}
        options={DocumentType}
        optionLabel="name"
        placeholder="Document Type"
        className="w-full md:w-14rem"
      />
    );
  };

  const FileUploadComp = ({ rowsData }) => {
    const fileUploadRef = useRef(null); // Reference for the file upload component

    const onUpload = (e) => {
      if (!rowsData?.selectedDocument) {
        alert('Choose Document Type');
        clearFileUpload();
        return;
      }
      const newFiles = e.files.map((file) => ({
        documentName: file.name,
        type: rowsData.selectedDocument?.name || '',
      }));

      updateRowData(rowsData?.id, {
        uploadedFiles: [...(rowsData.uploadedFiles || []), ...newFiles],
        selectedDocument: null,
      });

      alert('Files uploaded successfully!');
      clearFileUpload();
    };

    const clearFileUpload = () => {
      if (fileUploadRef.current) {
        fileUploadRef.current.clear(); // Clears the file upload input
      }
    };

    return (
      <FileUpload
        ref={fileUploadRef} // Attach the ref to the FileUpload component
        mode="basic"
        chooseLabel="Upload File"
        name="demo[]"
        accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
        maxFileSize={1000000}
        customUpload={true}
        onSelect={(e) => {
          onUpload(e);
        }}
      />
    );
  };

  useEffect(() => {
    ProductService.getProductsMini().then((data) => setProducts(data));
  }, []);

  const rowExpansionTemplate = (data) => {
    return (
      <div className="p-3">
        <h5>Uploaded files for {data.studentName}</h5>
        <DataTable value={data.uploadedFiles}>
          <Column
            body={(_, rowInfo) => <>{rowInfo.rowIndex + 1}</>}
            header="S.No."
          ></Column>
          <Column field="type" header="Document Type"></Column>
          <Column field="documentName" header="Document"></Column>
          <Column
            header="Action"
            body={() => (
              <div
                style={{
                  display: 'flex',
                  gap: '4px',
                  width: '100%',
                  justifyContent: 'center',
                }}
              >
                <Button icon="pi pi-eye" rounded outlined />
                <Button icon="pi pi-download" rounded outlined />
              </div>
            )}
          ></Column>
        </DataTable>
      </div>
    );
  };

  return (
    <div className="card">
      <DataTable
        value={products}
        showGridlines
        expandedRows={expandedRows}
        onRowToggle={(e) => setExpandedRows(e.data)}
        rowExpansionTemplate={rowExpansionTemplate}
        dataKey="id"
        tableStyle={{ minWidth: '50rem' }}
      >
        <Column expander={true} />
        <Column field="studentName" header="Student Name"></Column>
        <Column field="emailID" header="Email ID"></Column>
        <Column field="mobileNumber" header="Mobile Number"></Column>
        <Column
          header="Upload File"
          body={(rowsData) => (
            <div
              style={{
                display: 'flex',
                gap: '8px',
                width: '100%',
                justifyContent: 'center',
              }}
            >
              <RowDropDown rowsData={rowsData} />
              <FileUploadComp rowsData={rowsData} />
            </div>
          )}
        ></Column>
      </DataTable>
    </div>
  );
}
