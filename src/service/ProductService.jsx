export const ProductService = {
  getProductsData() {
    return [
      {
        id: '1',
        studentName: 'Mahesh Waghmare',
        emailID: 'maheshwaghmare.nbnssoe.comp@gmail.com',
        mobileNumber: '8899756321',
        documentName: '10th mark sheet',
        uploadedFiles: [
          { type: 'Aadhar', documentName: '321_aadhar.pdf' },
          { type: 'PAN', documentName: '321_pan.pdf' },
        ],
      },
      {
        id: '2',
        studentName: 'Suraj Mapari',
        emailID: 'surajmapari.nbnssoe.comp@gmail.com',
        mobileNumber: '7558756373',
        documentName: '12th mark sheet',
        uploadedFile: [],
      },
      {
        id: '3',
        studentName: 'Tinkal Patil',
        emailID: 'tinkalpatil6966@gmail.com',
        mobileNumber: '9875341209',
        documentName: 'PAN',
        uploadedFile: [],
      },
      {
        id: '4',
        studentName: 'Ankita Rohokale',
        emailID: 'rohokaleankita2003@gmail.com',
        mobileNumber: '8679085422',
        documentName: 'Aadhar',
        uploadedFile: [],
      },
      {
        id: '5',
        studentName: 'Gayatri Kharatmal',
        emailID: 'gayatrikharatmal.nbnssoe.comp@gmail.com',
        mobileNumber: '9325679804',
        documentName: 'Driving Licence',
        uploadedFile: [],
      },
    ];
  },

  getProductsMini() {
    return Promise.resolve(this.getProductsData().slice(0, 5));
  },

  getProductsSmall() {
    return Promise.resolve(this.getProductsData().slice(0, 10));
  },

  getProducts() {
    return Promise.resolve(this.getProductsData());
  },

  getProductsWithOrdersSmall() {
    return Promise.resolve(this.getProductsWithOrdersData().slice(0, 10));
  },

  getProductsWithOrders() {
    return Promise.resolve(this.getProductsWithOrdersData());
  },
};
