import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ProductService } from "./service/ProductService";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { FileUpload } from "primereact/fileupload";
import { Dialog } from "primereact/dialog";
import { TabView, TabPanel } from "primereact/tabview";
import { Message } from "primereact/message";

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

// function Demo2() {
//   const [products, setProducts] = useState([]);
//   const [expandedRows, setExpandedRows] = useState(null);
//   const [visible, setVisible] = useState({ show: false, data: {} });

//   const DocumentType = [
//     { name: "10th mark sheet", id: "1" },
//     { name: "12th mark sheet", id: "2" },
//     { name: "PAN", id: "3" },
//     { name: "Aadhar", id: "4" },
//     { name: "Driving License", id: "5" },
//   ];

//   const deleteDocument = (index, name) => {
//     setProducts((prevProducts) => {
//       const updatedProducts = [...prevProducts];
//       const currentRowsData = { ...updatedProducts[index] };
//       currentRowsData.uploadedFiles =
//         currentRowsData.uploadedFiles?.filter((x) => x.type !== name) || [];
//       updatedProducts[index] = currentRowsData;
//       setVisible((prevVisible) => ({
//         ...prevVisible,
//         data: { rowIndex: index, rowsData: currentRowsData },
//       }));
//       return updatedProducts;
//     });
//   };

//   const FileUploadComp = ({ data: { rowsData, rowIndex }, DocumentType }) => {
//     const fileUploadRef = useRef(null);

//     const onUpload = (e) => {
//       const newFiles = e.files.map((file) => ({
//         documentName: file.name,
//         type: DocumentType || "",
//       }));

//       setProducts((prevProducts) => {
//         const updatedProducts = [...prevProducts];
//         updatedProducts[rowIndex] = {
//           ...updatedProducts[rowIndex],
//           uploadedFiles: [
//             ...(updatedProducts[rowIndex].uploadedFiles || []),
//             ...newFiles,
//           ],
//           selectedDocument: null,
//         };
//         setVisible((prevVisible) => ({
//           ...prevVisible,
//           data: { rowIndex: rowIndex, rowsData: updatedProducts[rowIndex] },
//         }));
//         return updatedProducts;
//       });
//       // alert("File Added successfully!");
//       clearFileUpload();
//     };

//     const clearFileUpload = () => {
//       if (fileUploadRef.current) {
//         fileUploadRef.current.clear();
//       }
//     };

//     return (
//       <FileUpload
//         ref={fileUploadRef}
//         mode="basic"
//         chooseLabel="Upload File"
//         name="demo[]"
//         accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
//         maxFileSize={1000000}
//         customUpload={true}
//         onSelect={(e) => {
//           onUpload(e);
//         }}
//       />
//     );
//   };

//   useEffect(() => {
//     ProductService.getProductsMini().then((data) => setProducts(data));
//   }, []);

//   const rowExpansionTemplate = (data) => {
//     return (
//       <div className="p-3">
//         <h5>Uploaded files for {data.studentName}</h5>
//         <DataTable value={data.uploadedFiles}>
//           <Column
//             body={(_, rowInfo) => <>{rowInfo.rowIndex + 1}</>}
//             header="S.No."
//           ></Column>
//           <Column field="type" header="Document Type"></Column>
//           <Column field="documentName" header="Document"></Column>
//           <Column
//             header="Action"
//             body={() => (
//               <div
//                 style={{
//                   display: "flex",
//                   gap: "4px",
//                   width: "100%",
//                   justifyContent: "center",
//                 }}
//               >
//                 <Button icon="pi pi-eye" rounded outlined />
//                 <Button icon="pi pi-download" rounded outlined />
//               </div>
//             )}
//           ></Column>
//         </DataTable>
//       </div>
//     );
//   };

//   return (
//     <div className="card">
//       <DataTable
//         value={products}
//         showGridlines
//         expandedRows={expandedRows}
//         onRowToggle={(e) => setExpandedRows(e.data)}
//         rowExpansionTemplate={rowExpansionTemplate}
//         dataKey="id"
//         tableStyle={{ minWidth: "50rem" }}
//       >
//         <Column expander={true} />
//         <Column field="studentName" header="Student Name"></Column>
//         <Column field="emailID" header="Email ID"></Column>
//         <Column field="mobileNumber" header="Mobile Number"></Column>
//         <Column
//           header="Upload / Manage Documents"
//           body={(rowsData, { rowIndex }) => (
//             <div
//               style={{
//                 display: "flex",
//                 gap: "8px",
//                 width: "100%",
//                 justifyContent: "center",
//               }}
//             >
//               <Button
//                 label="Upload / Manage"
//                 icon="pi pi-cloud-upload"
//                 onClick={() =>
//                   setVisible({ show: true, data: { rowsData, rowIndex } })
//                 }
//               />
//             </div>
//           )}
//         ></Column>
//       </DataTable>
//       <Dialog
//         header={`Upload / Manage Documents for ${
//           visible?.data?.rowsData?.studentName || ""
//         }`}
//         visible={visible.show}
//         draggable={false}
//         style={{ width: "50vw" }}
//         onHide={() => {
//           setVisible((prevVisible) => ({
//             ...prevVisible,
//             show: false,
//           }));
//         }}
//       >
//         <DataTable value={DocumentType} showGridlines>
//           <Column field="name" header="Document Type"></Column>
//           <Column
//             header="Upload Respective Documents"
//             body={(rowsData) => {
//               const rowSelectedDocument =
//                 visible.data.rowsData?.uploadedFiles?.find(
//                   (x) => x.type === rowsData.name
//                 );
//               return (
//                 <div style={{ display: "flex", justifyContent: "center" }}>
//                   {rowSelectedDocument ? (
//                     <div
//                       style={{
//                         display: "flex",
//                         justifyContent: "center",
//                         alignItems: "center",
//                         gap: "8px",
//                       }}
//                     >
//                       {rowSelectedDocument?.documentName || "File ERROR"}
//                       <Button
//                         icon="pi pi-times-circle"
//                         rounded
//                         text
//                         onClick={() => {
//                           deleteDocument(visible.data.rowIndex, rowsData.name);
//                         }}
//                       />
//                     </div>
//                   ) : (
//                     <FileUploadComp
//                       data={visible.data}
//                       DocumentType={rowsData.name}
//                     />
//                   )}
//                 </div>
//               );
//             }}
//           ></Column>
//         </DataTable>
//       </Dialog>
//     </div>
//   );
// }

function Demo2() {
  const [products, setProducts] = useState([]);
  const [expandedRows, setExpandedRows] = useState(null);
  const [visible, setVisible] = useState({ show: false, data: {} });
  const [selectedFiles, setSelectedFiles] = useState([]);

  const totalFiles = selectedFiles.length;
  const totalFileSize = selectedFiles.reduce((acc, file) => acc + file.size, 0);
  const totalFileSizeMB = (totalFileSize / (1024 * 1024)).toFixed(2);
  const isFileSizeExceeded = totalFileSizeMB > 100;

  const DocumentType = [
    { name: "10th mark sheet", id: "1" },
    { name: "12th mark sheet", id: "2" },
    { name: "PAN", id: "3" },
    { name: "Aadhar", id: "4" },
    { name: "Driving License", id: "5" },
  ];

  const deleteDocument = (index, name, rowSelectedDocument) => {
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

    setSelectedFiles((prevSelectedFiles) =>
      prevSelectedFiles.filter((file) => file.id !== rowSelectedDocument.id)
    );
  };

  const FileUploadComp = ({ data: { rowsData, rowIndex }, DocumentType }) => {
    const fileUploadRef = useRef(null);

    const onUpload = (e) => {
      const newFiles = e.files
        .map((file) => {
          if (file.size > 3 * 1024 * 1024) {
            alert("Each file size should not exceed 3MB");
            return null;
          }
          return {
            documentName: file.name,
            type: DocumentType || "",
            size: file.size,
            id: `${file.name}_${file.size}_${file.DocumentType}_${rowIndex}`,
          };
        })
        .filter((file) => file !== null);

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
        setSelectedFiles((prevSelectedFiles) => [
          ...prevSelectedFiles,
          ...newFiles,
        ]);
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
        fileUploadRef.current.clear();
      }
    };

    return (
      <FileUpload
        ref={fileUploadRef}
        mode="basic"
        chooseLabel="Choose File"
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
      <div className="flex flex-column justify-content-end p-2  align-items-end w-100">
        <span>Total Files Selected: {totalFiles}</span>
        <span style={{ color: isFileSizeExceeded ? "red" : "inherit" }}>
          Total File Size: {totalFileSizeMB} MB / 100 MB
        </span>
      </div>
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
      <div className="flex justify-content-end p-2">
        <Message text={"Upload All Selected Files"} />
        <Button label="Upload All" onClick={() => {}} />
      </div>
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
                      {!rowSelectedDocument?.uploaded && (
                        <span
                          style={{
                            fontSize: "12px",
                            border: "1px solid #ffcc00",
                            backgroundColor: "#ffffe0",
                            padding: "2px 4px",
                            borderRadius: "4px",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                            color: "#ffcc00",
                          }}
                        >
                          <i
                            className="pi pi-exclamation-triangle"
                            style={{ color: "#ffcc00" }}
                          ></i>
                          yet to upload
                        </span>
                      )}

                      {rowSelectedDocument?.documentName || "File ERROR"}
                      <Button
                        icon="pi pi-times-circle"
                        rounded
                        text
                        onClick={() => {
                          deleteDocument(
                            visible.data.rowIndex,
                            rowsData.name,
                            rowSelectedDocument
                          );
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

        <div className="flex justify-content-end p-2">
          <Message
            text={
              "Upload Selected Files For " +
              visible?.data?.rowsData?.studentName
            }
          />
          <Button label="Upload" onClick={() => {}} />
        </div>
      </Dialog>
    </div>
  );
}

function Demo3() {
  const [products, setProducts] = useState([]);
  const [expandedRows, setExpandedRows] = useState({ 1: true });
  const [selectedFiles, setSelectedFiles] = useState([]);

  const totalFiles = selectedFiles.length;
  const totalFileSize = selectedFiles.reduce((acc, file) => acc + file.size, 0);
  const totalFileSizeMB = (totalFileSize / (1024 * 1024)).toFixed(2);
  const isFileSizeExceeded = totalFileSizeMB > 100;

  const DocumentType = [
    { name: "10th mark sheet", id: "1" },
    { name: "12th mark sheet", id: "2" },
    { name: "PAN", id: "3" },
    { name: "Aadhar", id: "4" },
    { name: "Driving License", id: "5" },
  ];

  const deleteDocument = (index, name, rowSelectedDocument) => {
    setProducts((prevProducts) => {
      const updatedProducts = [...prevProducts];
      const currentRowsData = { ...updatedProducts[index] };
      currentRowsData.uploadedFiles =
        currentRowsData.uploadedFiles?.filter((x) => x.type !== name) || [];
      updatedProducts[index] = currentRowsData;
      return updatedProducts;
    });

    setSelectedFiles((prevSelectedFiles) =>
      prevSelectedFiles.filter((file) => file.id !== rowSelectedDocument.id)
    );
  };

  const FileUploadComp = ({ data: { rowsData, rowIndex }, DocumentType }) => {
    const fileUploadRef = useRef(null);

    const onUpload = (e) => {
      const newFiles = e.files
        .map((file) => {
          if (file.size > 3 * 1024 * 1024) {
            alert("Each file size should not exceed 3MB");
            return null;
          }
          return {
            documentName: file.name,
            type: DocumentType || "",
            size: file.size,
            id: `${file.name}_${file.size}_${file.DocumentType}_${rowIndex}`,
          };
        })
        .filter((file) => file !== null);
      setSelectedFiles((prevSelectedFiles) => [
        ...prevSelectedFiles,
        ...newFiles,
      ]);

      setProducts((prevProducts) => {
        const updatedProducts = [...prevProducts];
        updatedProducts[rowIndex] = {
          ...updatedProducts[rowIndex],
          uploadedFiles: [
            ...(updatedProducts[rowIndex]?.uploadedFiles || []),
            ...newFiles,
          ],
          selectedDocument: null,
        };
        return updatedProducts;
      });
      clearFileUpload();
    };

    const clearFileUpload = () => {
      if (fileUploadRef.current) {
        fileUploadRef.current.clear();
      }
    };

    return (
      <FileUpload
        ref={fileUploadRef}
        mode="basic"
        chooseLabel="Choose File"
        name="demo[]"
        accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
        maxFileSize={3145728}
        customUpload={true}
        onSelect={(e) => {
          onUpload(e);
        }}
      />
    );
  };

  useEffect(() => {
    ProductService.getProductsMini().then((data) => {
      setProducts(data);
      setExpandedRows(data[0]);
    });
  }, []);

  const rowExpansionTemplate = (rowsData, { index: rowIndex }) => {
    return (
      <div className="p-3">
        <div className="flex justify-content-between">
          <h5>Uploaded files for {rowsData.studentName}</h5>
          <div>
            <Message
              text={"Upload Selected Files for " + rowsData.studentName}
            />
            <Button label="Upload Now" onClick={() => {}} />
          </div>
        </div>
        <DataTable value={DocumentType} showGridlines>
          <Column field="name" header="Document Type"></Column>
          <Column
            header="Upload Respective Documents"
            body={(documentRow) => {
              const rowSelectedDocument = rowsData?.uploadedFiles?.find(
                (x) => x.type === documentRow.name
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
                      {!rowSelectedDocument?.uploaded && (
                        <span
                          style={{
                            fontSize: "12px",
                            border: "1px solid #ffcc00",
                            backgroundColor: "#ffffe0",
                            padding: "2px 4px",
                            borderRadius: "4px",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                            color: "#ffcc00",
                          }}
                        >
                          <i
                            className="pi pi-exclamation-triangle"
                            style={{ color: "#ffcc00" }}
                          ></i>
                          yet to upload
                        </span>
                      )}

                      {rowSelectedDocument?.documentName || "File ERROR"}
                      <Button
                        icon="pi pi-times-circle"
                        rounded
                        text
                        onClick={() => {
                          deleteDocument(
                            rowIndex,
                            documentRow.name,
                            rowSelectedDocument
                          );
                        }}
                      />
                    </div>
                  ) : (
                    <FileUploadComp
                      data={{ rowsData, rowIndex }}
                      DocumentType={documentRow.name}
                    />
                  )}
                </div>
              );
            }}
          ></Column>
        </DataTable>
      </div>
    );
  };

  return (
    <div className="card">
      <div className="flex flex-column justify-content-end p-2  align-items-end w-100">
        <span>Total Files Selected: {totalFiles}</span>
        <span style={{ color: isFileSizeExceeded ? "red" : "inherit" }}>
          Total File Size: {totalFileSizeMB} MB / 100 MB
        </span>
      </div>
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
      </DataTable>
      <div className="flex justify-content-end p-2">
        <Message text={"Upload All Selected Files"} />
        <Button
          label="Upload All"
          onClick={() => {}}
          disabled={isFileSizeExceeded}
        />
      </div>
    </div>
  );
}

export default function GridLinesDemo() {
  return (
    <div className="card">
      <TabView>
        {/* <TabPanel header="Sample I">
          <Demo1 />
        </TabPanel> */}
        <TabPanel header="Sample I">
          <Demo2 />
        </TabPanel>
        <TabPanel header="Sample II">
          <Demo3 />
        </TabPanel>
      </TabView>
    </div>
  );
}
