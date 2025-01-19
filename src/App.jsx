import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ProductService } from "./service/ProductService";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { FileUpload } from "primereact/fileupload";
import { Dialog } from "primereact/dialog";
import { TabView, TabPanel } from "primereact/tabview";

function Demo1() {
  const [products, setProducts] = useState([]);
  const [expandedRows, setExpandedRows] = useState(null);

  const DocumentType = [
    { name: "10th mark sheet", id: "1" },
    { name: "12th mark sheet", id: "2" },
    { name: "PAN", id: "3" },
    { name: "Aadhar", id: "4" },
    { name: "Driving Licence", id: "5" },
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
        alert("Choose Document Type");
        clearFileUpload();
        return;
      }
      const newFiles = e.files.map((file) => ({
        documentName: file.name,
        type: rowsData.selectedDocument?.name || "",
      }));

      updateRowData(rowsData?.id, {
        uploadedFiles: [...(rowsData.uploadedFiles || []), ...newFiles],
        selectedDocument: null,
      });

      alert("Files uploaded successfully!");
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
                  display: "flex",
                  gap: "4px",
                  width: "100%",
                  justifyContent: "center",
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
        tableStyle={{ minWidth: "50rem" }}
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
                display: "flex",
                gap: "8px",
                width: "100%",
                justifyContent: "center",
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

function Demo2() {
  const [products, setProducts] = useState([]);
  const [expandedRows, setExpandedRows] = useState(null);
  const [visible, setVisible] = useState({ show: false, data: {} });

  const DocumentType = [
    { name: "10th mark sheet", id: "1" },
    { name: "12th mark sheet", id: "2" },
    { name: "PAN", id: "3" },
    { name: "Aadhar", id: "4" },
    { name: "Driving License", id: "5" },
  ];

  // const updateRowData = (id, updates) => {
  //   setProducts((prevProducts) =>
  //     prevProducts.map((product) =>
  //       product.id === id ? { ...product, ...updates } : product
  //     )
  //   );
  // };

  // const RowDropDown = ({ rowsData }) => {
  //   const onValueChange = (e) => {
  //     // setSelectedDocument(e.value);
  //     updateRowData(rowsData?.id, { selectedDocument: e.value });
  //   };

  //   return (
  //     <Dropdown
  //       value={rowsData?.selectedDocument || null}
  //       onChange={(e) => onValueChange(e)}
  //       options={DocumentType}
  //       optionLabel="name"
  //       placeholder="Document Type"
  //       className="w-full md:w-14rem"
  //     />
  //   );
  // };

  const deleteDocument = (index, name) => {
    setProducts((prevProducts) => {
      const updatedProducts = [...prevProducts];
      const currentRowsData = { ...updatedProducts[index] };
      currentRowsData.uploadedFiles =
        currentRowsData.uploadedFiles?.filter((x) => x.type !== name) || [];
      updatedProducts[index] = currentRowsData;
      setVisible((prevVisible) => ({
        ...prevVisible,
        data: { rowIndex: index, rowsData: currentRowsData },
      }));
      return updatedProducts;
    });
  };

  const FileUploadComp = ({ data: { rowsData, rowIndex }, DocumentType }) => {
    const fileUploadRef = useRef(null);

    const onUpload = (e) => {
      const newFiles = e.files.map((file) => ({
        documentName: file.name,
        type: DocumentType || "",
      }));

      setProducts((prevProducts) => {
        const updatedProducts = [...prevProducts];
        updatedProducts[rowIndex] = {
          ...updatedProducts[rowIndex],
          uploadedFiles: [
            ...(updatedProducts[rowIndex].uploadedFiles || []),
            ...newFiles,
          ],
          selectedDocument: null,
        };
        setVisible((prevVisible) => ({
          ...prevVisible,
          data: { rowIndex: rowIndex, rowsData: updatedProducts[rowIndex] },
        }));
        return updatedProducts;
      });
      // alert("File Added successfully!");
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
                  display: "flex",
                  gap: "4px",
                  width: "100%",
                  justifyContent: "center",
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
        tableStyle={{ minWidth: "50rem" }}
      >
        <Column expander={true} />
        <Column field="studentName" header="Student Name"></Column>
        <Column field="emailID" header="Email ID"></Column>
        <Column field="mobileNumber" header="Mobile Number"></Column>
        <Column
          header="Upload / Manage Documents"
          body={(rowsData, { rowIndex }) => (
            <div
              style={{
                display: "flex",
                gap: "8px",
                width: "100%",
                justifyContent: "center",
              }}
            >
              <Button
                label="Upload / Manage"
                icon="pi pi-cloud-upload"
                onClick={() =>
                  setVisible({ show: true, data: { rowsData, rowIndex } })
                }
              />
            </div>
          )}
        ></Column>
      </DataTable>
      <Dialog
        header={`Upload / Manage Documents for ${
          visible?.data?.rowsData?.studentName || ""
        }`}
        visible={visible.show}
        draggable={false}
        style={{ width: "50vw" }}
        onHide={() => {
          setVisible((prevVisible) => ({
            ...prevVisible,
            show: false,
          }));
        }}
      >
        <DataTable value={DocumentType} showGridlines>
          <Column field="name" header="Document Type"></Column>
          <Column
            header="Upload Respective Documents"
            body={(rowsData) => {
              const rowSelectedDocument =
                visible.data.rowsData?.uploadedFiles?.find(
                  (x) => x.type === rowsData.name
                );
              return (
                <div style={{ display: "flex", justifyContent: "center" }}>
                  {rowSelectedDocument ? (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      {rowSelectedDocument?.documentName || "File ERROR"}
                      <Button
                        icon="pi pi-times-circle"
                        rounded
                        text
                        onClick={() => {
                          deleteDocument(visible.data.rowIndex, rowsData.name);
                        }}
                      />
                    </div>
                  ) : (
                    <FileUploadComp
                      data={visible.data}
                      DocumentType={rowsData.name}
                    />
                  )}
                </div>
              );
            }}
          ></Column>
        </DataTable>
      </Dialog>
    </div>
  );
}

export default function GridLinesDemo() {
  return (
    <div className="card">
      <TabView>
        <TabPanel header="Sample I">
          <Demo1 />
        </TabPanel>
        <TabPanel header="Sample II">
          <Demo2 />
        </TabPanel>
      </TabView>
    </div>
  );
}
