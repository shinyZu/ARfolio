import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";

import RestoreIcon from "@mui/icons-material/Restore";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import AdminNavbar from "../../components/Navbar/AdminNavbar";
import FileChooser from "../../components/common/FileChooser/FileChooser";
import MyTextField from "../../components/common/MyTextField/MyTextField";
import MyButton from "../../components/common/MyButton/MyButton";
import AdminTable from "../../components/common/TableSearchPage/TableSearch";
import MyTable from "../../components/common/MyTable/MyTable";
import ConfirmDialog from "../../components/common/ConfirmDialog/ConfirmDialog";
import MySnackBar from "../../components/common/Snackbar/MySnackbar";
import Footer from "../../components/Footer/Footer";

import { styleSheet } from "./styles";
import { withStyles } from "@mui/styles";

import CategoryService from "../../services/CategoryService";
import StationeryService from "../../services/StationeryService";

// import upload_bg from "../../assets/images/bg_login_1.jpg";
import upload_bg from "../../assets/images/choose_image.jpg";

const AdminPanel = (props) => {
  const { classes } = props;
  const [token, setToken] = useState(
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aW1lIjoiU3VuIEp1bCAyMyAyMDIzIDEwOjM3OjAwIEdNVCswNTMwIChJbmRpYSBTdGFuZGFyZCBUaW1lKSIsInVzZXJJZCI6MiwidXNlcm5hbWUiOiJqb2huQGdtYWlsLmNvbSIsInBhc3N3b3JkIjoiJDJhJDEwJDg1cGV6ckFlZXoudDIxVFkxNnpTR3VXb3lPbmJvd2RUbnlRZG5RamdpTmt3SThXM1hsREZXIiwidXNlcl9yb2xlIjoiQWRtaW4iLCJpYXQiOjE2OTAwODg4MjAsImV4cCI6MTY5MDA5MDYyMH0.w6TSvCEUPo0_ryDE-ScMzAXYtazHgNisB_MRqGun9j4"
  );

  const [categoryCode, setCategoryCode] = useState(""); // used in for drop down
  const [categoryName, setCategoryName] = useState(""); // used in for drop down
  const [productCode, setProductCode] = useState(0); // used in for drop down

  const [categoryId, setCategoryId] = useState(0); // used in category form
  const [categoryTitle, setCategoryTitle] = useState(""); // used in category form

  const [newCategoryFormData, setNewCategoryFormData] = useState({
    category_id: "",
    category: "",
  });

  const [newProductFormData, setNewProductFormData] = useState({
    st_code: "",
    st_name: "",
    description: "",
    // image_name: "",
    // image_url: "",
    unit_price: "",
    qty_on_hand: "",
    category_id: "",
    product_image: null,
  });

  const [categoryData, setCategoryData] = useState([]);
  const [productData, setProductData] = useState([]);

  const [categoryDropDown, setCategoryDropDown] = useState([]);

  const [btnProps, setBtnProps] = useState({
    btnLabel: "Add Product",
    // btnColor: "#1abc9c",
  });

  const [btnCategoryProps, setBtnCategoryProps] = useState({
    btnLabel: "Add Category",
    // btnColor: "#1abc9c",
  });

  //----------------
  const imageTypeRegex = "/image/(png|jpg|jpeg)/gm";
  const [imageFile, setImageFile] = useState([]);
  const [image, setImage] = useState([]);
  const [validImageFile, setValidImageFile] = useState(null);
  const [fileToUpload, setFileToUpload] = useState([]);

  const [media, setMedia] = useState(upload_bg);
  //---------------------

  const [openAlert, setOpenAlert] = useState({
    open: "",
    alert: "",
    severity: "",
    variant: "",
  });

  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    subTitle: "",
    confirmBtnStyle: {},
    action: "",
  });

  const tbl_category_columns = [
    {
      field: "id",
      headerName: "Actions",
      renderCell: (cellValues) => {
        // console.log(cellValues);
        return (
          <>
            <Tooltip title="Edit">
              <IconButton>
                <EditIcon
                  // fontSize="large"
                  onClick={() => {
                    console.log("clicked row : " + cellValues.id);
                    console.log(categoryData[cellValues.id]);
                    loadCategoryDataToFields(
                      cellValues.id,
                      categoryData[cellValues.id]
                    );
                  }}
                />
              </IconButton>
            </Tooltip>

            <Tooltip title="Delete">
              <IconButton>
                <DeleteIcon
                  // fontSize="large"
                  onClick={() => {
                    console.log("clicked row : " + cellValues.id);
                    deleteCategory(categoryData[cellValues.id]);
                  }}
                />
              </IconButton>
            </Tooltip>
          </>
        );
      },
      width: 200,
      headerClassName: "header_color",
      headerAlign: "center",
      align: "Center",
    },
    {
      field: "category_id",
      headerName: "Category Code",
      width: 245,
      headerClassName: "header_color",
      headerAlign: "center",
      align: "Center",
    },

    {
      field: "category_name",
      headerName: "Category Name",
      width: 248,
      headerClassName: "header_color",
      headerAlign: "center",
      align: "Center",
    },
  ];

  const tbl_product_columns = [
    {
      field: "id",
      headerName: "Actions",
      renderCell: (cellValues) => {
        // console.log(cellValues);
        return (
          <>
            <Tooltip title="Edit">
              <IconButton>
                <EditIcon
                  // fontSize="large"
                  onClick={() => {
                    console.log("clicked row : " + cellValues.id);
                    console.log(productData[cellValues.id]);
                    loadProductDataToFields(
                      cellValues.id,
                      productData[cellValues.id]
                    );
                  }}
                />
              </IconButton>
            </Tooltip>

            <Tooltip title="Delete">
              <IconButton>
                <DeleteIcon
                  // fontSize="large"
                  onClick={() => {
                    console.log("clicked row : " + cellValues.id);
                    deleteProduct(productData[cellValues.id]);
                  }}
                />
              </IconButton>
            </Tooltip>
          </>
        );
      },
      width: 180,
      headerClassName: "header_color",
      headerAlign: "center",
      align: "Center",
    },
    {
      field: "st_code",
      headerName: "Product Code",
      width: 150,
      headerClassName: "header_color",
      headerAlign: "center",
      align: "Center",
    },

    {
      field: "st_name",
      headerName: "Product Name",
      width: 220,
      headerClassName: "header_color",
      headerAlign: "center",
      align: "Center",
    },

    {
      field: "description",
      headerName: "Description",
      width: 250,
      headerClassName: "header_color",
      headerAlign: "center",
      align: "Center",
    },

    {
      field: "category_id",
      headerName: "Category",
      width: 150,
      headerClassName: "header_color",
      headerAlign: "center",
      align: "Center",
    },

    {
      field: "unit_price",
      headerName: "Unit Price",
      width: 180,
      headerClassName: "header_color",
      headerAlign: "center",
      align: "Center",
    },

    {
      field: "qty_on_hand",
      headerName: "Qty On Hand",
      width: 160,
      headerClassName: "header_color",
      headerAlign: "center",
      align: "Center",
    },
  ];

  // useEffect(() => {
  //   console.log("---handling login in Admin Panel-----");
  //   let token = localStorage.getItem("token");
  //   console.log(token);
  //   if (token) {
  //     props.handleLogin(true);
  //     // navigate("/home");
  //   } else {
  //     props.handleLogin(false);
  //     // navigate("/home");
  //   }
  // });

  useEffect(() => {
    console.log("useEffect []");
    getAllCategories();
    getAllProducts();
    getNextProductId();
    getNextCategoryId();
  }, []);

  const getAllCategories = async () => {
    console.log("Get all categories");
    let res = await CategoryService.getAll();

    if (res.status == 200) {
      if (res.data.data != []) {
        console.log(res.data.data);
        setCategoryData(() => {
          return [...res.data.data];
        });

        setCategoryDropDown([]);
        res.data.data.map((category, index) => {
          setCategoryDropDown((prev) => {
            return [
              ...prev,
              {
                categoryId: category.category_id,
                categoryTitle: category.category,
              },
            ];
          });
        });
      }
    }
    console.log(categoryDropDown);
  };

  const getAllProducts = async () => {
    console.log("Get all stationery");
    let res = await StationeryService.getAll();

    if (res.data.status == 200) {
      if (res.data.data != []) {
        console.log(res.data.data);
        setProductData(() => {
          return [...res.data.data];
        });
      }
    }
  };

  const getNextProductId = async () => {
    console.log("--------2------------");
    console.log("Get next stationery id");
    let res = await StationeryService.getNextId();

    if (res.status === 200) {
      console.log("next product id: " + res.data.data.next_id);
      console.log("--------3------------");
      setProductCode(res.data.data.next_id);
    }
  };

  const getNextCategoryId = async () => {
    console.log("Get next category id");
    let res = await CategoryService.getNextId();

    if (res.status === 200) {
      console.log("next category id: " + res.data.data.next_id);
      setCategoryId(res.data.data.next_id);
    }
  };

  const loadProductDataToFields = async (rowId, product) => {
    console.log(product);
    setBtnProps({ btnLabel: "Edit Product" });

    setNewProductFormData({
      st_code: product.st_code,
      st_name: product.st_name,
      description: product.description,
      // image_name: product.image_name,
      // image_url: product.image_url,
      unit_price: product.unit_price,
      qty_on_hand: product.qty_on_hand,
      category_id: product.category_id,
      product_image: product.image_url,
    });

    setProductCode(product.st_code);

    // Find the category name with the category id
    const ctg = categoryDropDown.find(
      (category) => category.categoryId === product.category_id
    );
    setCategoryName(ctg.categoryTitle);

    if (product.image_url != "") {
      setMedia(product.image_url);
    } else {
      setMedia(upload_bg);
    }
  };

  const loadCategoryDataToFields = async (rowId, category) => {
    console.log(category);
    setBtnCategoryProps({ btnLabel: "Update Category" });

    setNewCategoryFormData({
      category_id: category.category,
      category: category.category,
    });

    setCategoryId(category.category_id);
    // setCategoryTitle(category.categoryTitle);
  };

  const clearProductForm = () => {
    console.log("--------1------------");
    getNextProductId();

    setNewProductFormData({
      st_code: "",
      st_name: "",
      description: "",
      image_name: "",
      image_url: "",
      unit_price: "",
      qty_on_hand: "",
      category_id: "",
    });
    setCategoryName("");
    setMedia(upload_bg);
    setFileToUpload([]);
    setBtnProps({ btnLabel: "Add Product" });
  };

  const clearCategoryForm = () => {
    getNextCategoryId();

    setNewCategoryFormData({
      category_id: "",
      category: "",
    });

    setBtnCategoryProps({ btnLabel: "Add Category" });
  };

  const handleMediaUpload = (e) => {
    // handleImageUpload(e);
    const { files } = e.target;
    setFileToUpload(files[0]);

    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      const { result } = e.target;
      // console.log(result);
      if (result) {
        setMedia(result);
      }
    };
    fileReader.readAsDataURL(files[0]);
  };

  // ----- Save Category -----------
  const saveCategory = () => {
    console.log(newCategoryFormData);
    if (newCategoryFormData.category != "") {
      setConfirmDialog({
        isOpen: true,
        title: "Are you sure you want to save this Category?",
        subTitle: "You can't revert this operation",
        action: "Save",
        confirmBtnStyle: {
          backgroundColor: "rgb(26, 188, 156)",
          color: "white",
        },
        onConfirm: () => proceedSaveCategory(),
      });
    } else {
      setOpenAlert({
        open: true,
        alert: "Please fill the catgeory name!",
        severity: "warning",
        variant: "standard",
      });
    }
  };

  const proceedSaveCategory = async () => {
    let res = await CategoryService.saveCategory(newCategoryFormData);
    console.log(res);
    if (res.status === 201) {
      setOpenAlert({
        open: true,
        alert: res.data.message,
        severity: "success",
        variant: "standard",
      });
      getAllCategories();
      clearCategoryForm();
      setConfirmDialog({ isOpen: false });
      setBtnCategoryProps({ btnLabel: "Add Category" });
    } else {
      setConfirmDialog({ isOpen: false });
      setOpenAlert({
        open: true,
        alert: res.response.data.message,
        severity: "error",
        variant: "standard",
      });
    }
  };

  // ----- Update Category -----------
  const updateCategory = () => {
    console.log("Updating category");
    console.log(newCategoryFormData);
    if (newCategoryFormData.category != "") {
      setConfirmDialog({
        isOpen: true,
        title: "Are you sure you want to update this Category?",
        subTitle: "You can't revert this operation",
        confirmBtnStyle: { backgroundColor: "#2980b9", color: "white" },
        onConfirm: () => proceedUpdateCategory(),
      });
    } else {
      setOpenAlert({
        open: true,
        alert: "Please fill the catgeory name!",
        severity: "warning",
        variant: "standard",
      });
    }
  };

  const proceedUpdateCategory = async () => {
    let res = await CategoryService.updateCategory(newCategoryFormData);
    console.log(res);
    if (res.status === 200) {
      setOpenAlert({
        open: true,
        alert: res.data.message,
        severity: "success",
        variant: "standard",
      });
      getAllCategories();
      clearCategoryForm();
      setConfirmDialog({ isOpen: false });
      setBtnCategoryProps({ btnLabel: "Add Category" });
    } else {
      setConfirmDialog({ isOpen: false });
      setOpenAlert({
        open: true,
        alert: res.response.data.message,
        severity: "error",
        variant: "standard",
      });
    }
  };

  // ----- Delete Category -----------
  const deleteCategory = (category) => {
    console.log(category);
    setConfirmDialog({
      isOpen: true,
      title: "Are you sure you want to delete this Category?",
      subTitle: "You can't revert this operation",
      confirmBtnStyle: { backgroundColor: "red", color: "white" },
      action: "Delete",
      onConfirm: () => proceedDeleteCategory(category.category_id),
    });
  };

  const proceedDeleteCategory = async (category_id) => {
    console.log(category_id);
    let res = await CategoryService.deleteCategory(category_id);
    if (res.status === 200) {
      setOpenAlert({
        open: true,
        alert: res.data.message,
        severity: "success",
        variant: "standard",
      });
      getAllCategories();
      clearCategoryForm();
      setConfirmDialog({ isOpen: false });
    } else {
      setOpenAlert({
        open: true,
        alert: res.response.data.message,
        severity: "error",
        variant: "standard",
      });
    }
  };

  // --------Save Product------------
  const saveProduct = () => {
    console.log(newProductFormData);
    if (newProductFormData.product_image != null) {
      console.log("files are choosen");

      setConfirmDialog({
        isOpen: true,
        title: "Are you sure you want to save this Product ?",
        subTitle: "You can't revert this operation",
        action: "Save",
        confirmBtnStyle: {
          backgroundColor: "rgb(26, 188, 156)",
          color: "white",
        },
        onConfirm: () => saveProductWithImage(),
      });
    } else {
      setOpenAlert({
        open: true,
        alert: "Please choose an image for " + newProductFormData.st_name,
        severity: "warning",
        variant: "standard",
      });
    }
  };

  const saveProductWithImage = async () => {
    console.log("Saving stationery with image");
    console.log(newProductFormData);

    // To save without image
    if (
      newProductFormData.product_image == null ||
      newProductFormData.product_image == ""
    ) {
      setOpenAlert({
        open: true,
        alert: "Please choose an image for " + newProductFormData.st_name,
        severity: "warning",
        variant: "standard",
      });
    } else {
      // To save product with image
      console.log("Save WITH image");

      let data = new FormData();
      data.append("st_name", newProductFormData.st_name);
      data.append("description", newProductFormData.description);
      data.append("unit_price", newProductFormData.unit_price);
      data.append("qty_on_hand", newProductFormData.qty_on_hand);
      data.append("category_id", newProductFormData.category_id);
      data.append("product_image", newProductFormData.product_image);

      let res = await StationeryService.saveProductWithImage(
        newProductFormData
      );
      console.log(res);

      if (res.status == 201) {
        console.log("Product is saved");

        setOpenAlert({
          open: true,
          alert: res.data.message,
          severity: "success",
          variant: "standard",
        });

        getAllProducts();
        clearProductForm();

        setConfirmDialog({ isOpen: false });
      } else {
        setConfirmDialog({ isOpen: false });
        setOpenAlert({
          open: true,
          alert: res.response.data.message,
          severity: "error",
          variant: "standard",
        });
      }
    }
  };

  // --------Update Product------------
  const updateProduct = () => {
    // console.log(newProductFormData);
    // console.log(fileToUpload);

    if (fileToUpload.length === 0) {
      setConfirmDialog({
        isOpen: true,
        // severity: "warning",
        title: "No image selected, want to continue?",
        subTitle: "or click No to select an image and proceed",
        confirmBtnStyle: { backgroundColor: "#2980b9", color: "white" },
        onConfirm: () => updateProductWithImage(),
      });

      return;
    }

    if (newProductFormData.product_image != "") {
      // if (fileToUpload.length > 0) {
      console.log("files are choosen");

      setConfirmDialog({
        isOpen: true,
        title: "Are you sure you want to update this Product ?",
        subTitle: "You can't revert this operation",
        confirmBtnStyle: { backgroundColor: "#2980b9", color: "white" },
        onConfirm: () => updateProductWithImage(),
      });
    }
  };

  const updateProductWithImage = async () => {
    console.log("proceed update");

    if (fileToUpload.length === 0) {
      // Update product only (/:id)
      // if want to update without images
      let res = await StationeryService.updateProduct(
        newProductFormData,
        newProductFormData.st_code
      );
      console.log(res);
      if (res.status === 200) {
        setOpenAlert({
          open: true,
          alert: res.data.message,
          severity: "success",
          variant: "standard",
        });
        getAllProducts();
        clearProductForm();
        setConfirmDialog({ isOpen: false });
        setBtnProps({ btnLabel: "Add Product" });
      } else {
        setConfirmDialog({ isOpen: false });
        setOpenAlert({
          open: true,
          alert: res.response.data.message,
          severity: "error",
          variant: "standard",
        });
      }
    } else {
      // To update product with image
      console.log("Save WITH image");

      // Update product only (/:id)
      let res1 = await StationeryService.updateProduct(
        newProductFormData,
        newProductFormData.st_code
      );
      console.log(res1);

      if (res1.status === 200) {
        console.log("Product is saved...now save the image");

        // Update image only (/drive/url/db/:st_code)
        let data = new FormData();
        data.append("product_image", newProductFormData.product_image);

        let res2 = await StationeryService.updateImage(
          newProductFormData.st_code,
          data
        );

        if (res2.status === 200) {
          console.log("Image too saved successfully...........");

          setOpenAlert({
            open: true,
            alert: res1.data.message,
            severity: "success",
            variant: "standard",
          });

          getAllProducts();
          clearProductForm();
          setConfirmDialog({ isOpen: false });
        } else {
          setConfirmDialog({ isOpen: false });
          setOpenAlert({
            open: true,
            alert: res2.response.data.message,
            severity: "error",
            variant: "standard",
          });
        }
      } else {
        setConfirmDialog({ isOpen: false });
        setOpenAlert({
          open: true,
          alert: res1.response.data.message,
          severity: "error",
          variant: "standard",
        });
      }
    }
  };

  // --------Delete Product -------------
  const deleteProduct = (product) => {
    console.log(product);
    setConfirmDialog({
      isOpen: true,
      title: "Are you sure you want to delete this Product?",
      subTitle: "You can't revert this operation",
      confirmBtnStyle: { backgroundColor: "red", color: "white" },
      action: "Delete",
      onConfirm: () => deleteProductWithImage(product.st_code),
    });
  };

  const deleteProductWithImage = async (st_code) => {
    console.log(st_code);
    let res = await StationeryService.deleteProduct(st_code);
    if (res.status === 200) {
      setOpenAlert({
        open: true,
        alert: res.data.message,
        severity: "success",
        variant: "standard",
      });
      getAllProducts();
      clearProductForm();
      setConfirmDialog({ isOpen: false });
    } else {
      setOpenAlert({
        open: true,
        alert: res.response.data.message,
        severity: "error",
        variant: "standard",
      });
    }
  };

  return (
    <div id="home">
      <AdminNavbar handleLogin={props.handleLogin} />

      <Box sx={{ flexGrow: 1 }} className={classes.box_container}>
        <Grid
          container
          xl={12}
          lg={12}
          md={12}
          sm={12}
          xs={12}
          className={classes.main_container}
          display="flex"
          justifyContent="space-between"
        >
          {/* --------------------- Add Category Section ---------------------- */}
          <Grid
            container
            xl={12}
            lg={12}
            md={12}
            sm={12}
            xs={12}
            className={classes.category_main_container}
            display="flex"
            justifyContent="space-between"
          >
            {/* --------------------- Category Fields & Button ---------------------- */}
            <Grid
              container
              rowGap={2}
              xl={4.9}
              lg={4.9}
              md={4.9}
              sm={12}
              xs={12}
              className={classes.category_main_container_left}
              display="flex"
              // justifyContent="space-between"
            >
              <Grid
                item
                xl={12}
                lg={12}
                md={12}
                sm={12}
                xs={12}
                className={classes.category_title_container}
                display="flex"
                // justifyContent="space-between"
              >
                <Typography variant="h5" className={classes.category_title}>
                  Add New Category
                </Typography>
              </Grid>

              <Grid
                item
                xl={12}
                lg={12}
                md={12}
                sm={12}
                xs={12}
                className={classes.category_fields_container}
                display="flex"
                // justifyContent="space-between"
              >
                {/* -------- Row 1 ------------- */}
                <Grid
                  container
                  xl={12}
                  lg={12}
                  md={12}
                  sm={12}
                  xs={12}
                  className={classes.category_field_row}
                  display="flex"
                >
                  <MyTextField
                    variant="outlined"
                    type="text"
                    id="category_id"
                    placeholder="Category Code"
                    value={categoryId}
                    disabled
                    onChange={(e) => {
                      setNewCategoryFormData({
                        ...newCategoryFormData,
                        category_id: categoryId,
                      });
                    }}
                    style={{ width: "100%", paddingTop: "5px" }}
                  />
                </Grid>
              </Grid>

              {/* -------- Row 2 ------------- */}
              <Grid
                container
                xl={12}
                lg={12}
                md={12}
                sm={12}
                xs={12}
                className={classes.category_field_row}
                display="flex"
              >
                <MyTextField
                  variant="outlined"
                  type="text"
                  id="ct_name"
                  placeholder="Category Name"
                  value={newCategoryFormData.category}
                  onChange={(e) => {
                    setNewCategoryFormData({
                      ...newCategoryFormData,
                      category_id: categoryId,
                      category: e.target.value,
                    });
                  }}
                  style={{ width: "100%", paddingTop: "5px" }}
                />
              </Grid>

              {/* ------- Add Category Button------- */}
              <Grid
                item
                xl={12}
                lg={12}
                md={12}
                sm={12}
                xs={12}
                className={classes.btn_save_category_container}
                display="flex"
                justifyContent="space-between"
              >
                <MyButton
                  label={btnCategoryProps.btnLabel}
                  size="small"
                  variant="outlined"
                  type="button"
                  className={
                    btnCategoryProps.btnLabel == "Add Category"
                      ? classes.btn_save
                      : classes.btn_update
                  }
                  style={{ width: "48%", height: "90%" }}
                  onClick={
                    btnCategoryProps.btnLabel == "Add Category"
                      ? saveCategory
                      : updateCategory
                  }
                />

                <MyButton
                  label="Clear Form"
                  size="small"
                  variant="outlined"
                  type="button"
                  className={classes.btn_clear}
                  style={{ width: "48%", height: "90%" }}
                  onClick={(e) => {
                    console.log("Clearing category form");
                    clearCategoryForm();
                  }}
                />
              </Grid>
            </Grid>

            {/* --------------------- Category Table---------------------- */}

            <Grid
              container
              xl={7}
              lg={7}
              md={7}
              sm={12}
              xs={12}
              className={classes.category_main_container_right}
              display="flex"
              justifyContent="end"
            >
              <AdminTable
                // page="CR"
                tableColumns={tbl_category_columns}
                tableData={categoryData.map((category, index) => ({
                  id: index,
                  category_id: category.category_id,
                  category_name: category.category,
                }))}
                // getRowId={(row) => row.reg_no}
                rowsPerPageOptions={5}
              />
            </Grid>
          </Grid>

          {/* --------------------- Add Stationery Section ---------------------- */}
          <Grid
            container
            xl={12}
            lg={12}
            md={12}
            sm={12}
            xs={12}
            className={classes.product_main_container}
            display="flex"
            justifyContent="space-between"
          >
            {/* -------------- Add Product Fields Section --------- */}

            <Grid
              container
              rowGap={2}
              xl={4.9}
              lg={4.9}
              md={4.9}
              sm={12}
              xs={12}
              className={classes.product_main_container_left}
              display="flex"
              // justifyContent="space-between"
            >
              <Grid
                item
                xl={12}
                lg={12}
                md={12}
                sm={12}
                xs={12}
                className={classes.product_title_container}
                display="flex"
                // justifyContent="space-between"
              >
                <Typography variant="h5" className={classes.product_title}>
                  Add New Product
                </Typography>
              </Grid>

              <Grid
                item
                xl={12}
                lg={12}
                md={12}
                sm={12}
                xs={12}
                className={classes.product_fields_container}
                display="flex"
                // justifyContent="center"
              >
                {/* -------- Row 1 ------------- */}
                <Grid
                  container
                  xl={12}
                  lg={12}
                  md={12}
                  sm={12}
                  xs={12}
                  className={classes.product_field_row}
                  display="flex"
                  justifyContent="space-between"
                >
                  <Grid
                    item
                    xl={5.8}
                    lg={5.8}
                    md={5.8}
                    sm={12}
                    xs={12}
                    className={classes.product_field_row_left}
                  >
                    <MyTextField
                      variant="outlined"
                      type="text"
                      id="st_code"
                      placeholder="Product Code"
                      // value={newProductFormData.st_code}
                      value={productCode}
                      disabled
                      onChange={(e) => {
                        setNewProductFormData({
                          ...newProductFormData,
                          st_code: productCode,
                        });
                      }}
                      // onChange={(e) => setProductCode(e.target.value)}
                      style={{ width: "100%", paddingTop: "5px" }}
                    />
                  </Grid>

                  <Grid
                    item
                    xl={5.8}
                    lg={5.8}
                    md={5.8}
                    sm={12}
                    xs={12}
                    className={classes.product_field_row_right}
                  >
                    <MyTextField
                      variant="outlined"
                      type="text"
                      id="st_name"
                      placeholder="Product Name"
                      value={newProductFormData.st_name}
                      // onChange={(e) => setProductName(e.target.value)}
                      onChange={(e) => {
                        setNewProductFormData({
                          ...newProductFormData,
                          st_code: productCode,
                          st_name: e.target.value,
                        });
                      }}
                      style={{ width: "100%", paddingTop: "5px" }}
                    />
                  </Grid>
                </Grid>
              </Grid>

              {/* -------- Row 2 ------------- */}
              <Grid
                container
                xl={12}
                lg={12}
                md={12}
                sm={12}
                xs={12}
                className={classes.product_field_row}
                display="flex"
              >
                <MyTextField
                  variant="outlined"
                  type="text"
                  id="description"
                  placeholder="Product Description"
                  value={newProductFormData.description}
                  // onChange={(e) => setCategoryName(e.target.value)}
                  onChange={(e) => {
                    setNewProductFormData({
                      ...newProductFormData,
                      description: e.target.value,
                    });
                  }}
                  style={{ width: "100%", paddingTop: "5px" }}
                />
              </Grid>

              {/* -------- Row 3 ------------- */}
              <Grid
                item
                xl={12}
                lg={12}
                md={12}
                sm={12}
                xs={12}
                className={classes.product_field_row}
                display="flex"
              >
                <Autocomplete
                  // className={classes.category_dropdown}
                  disablePortal
                  id="role"
                  options={categoryDropDown}
                  getOptionLabel={(option) => option.categoryTitle}
                  inputValue={categoryName}
                  sx={{ width: 600 }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Category"
                      styles={{ color: "red" }}
                    />
                  )}
                  size="small"
                  disabledItemsFocusable
                  onChange={(e, v) => {
                    setCategoryName(v.categoryTitle);
                    setNewProductFormData({
                      ...newProductFormData,
                      category_id: v.categoryId,
                    });
                  }}
                />
              </Grid>

              {/* -------- Row 4 ------------- */}
              <Grid
                container
                xl={12}
                lg={12}
                md={12}
                sm={12}
                xs={12}
                className={classes.product_field_row}
                display="flex"
                justifyContent="space-between"
              >
                <Grid
                  item
                  xl={5.8}
                  lg={5.8}
                  md={5.8}
                  sm={12}
                  xs={12}
                  className={classes.product_field_row_left}
                >
                  <MyTextField
                    variant="outlined"
                    type="text"
                    id="u_price"
                    placeholder="Unit Price (Rs)"
                    value={newProductFormData.unit_price}
                    onChange={(e) => {
                      setNewProductFormData({
                        ...newProductFormData,
                        unit_price: e.target.value,
                      });
                    }}
                    // onChange={(e) => setProductCode(e.target.value)}
                    style={{ width: "100%", paddingTop: "5px" }}
                  />
                </Grid>

                <Grid
                  item
                  xl={5.8}
                  lg={5.8}
                  md={5.8}
                  sm={12}
                  xs={12}
                  className={classes.product_field_row_right}
                >
                  <MyTextField
                    variant="outlined"
                    type="text"
                    id="qty"
                    placeholder="Quantity On Hand"
                    value={newProductFormData.qty_on_hand}
                    // onChange={(e) => setProductName(e.target.value)}
                    onChange={(e) => {
                      setNewProductFormData({
                        ...newProductFormData,
                        qty_on_hand: e.target.value,
                      });
                    }}
                    style={{ width: "100%", paddingTop: "5px" }}
                  />
                </Grid>
              </Grid>

              {/* ------- Add Stationery Button------- */}
              <Grid
                container
                // columnGap={2}
                xl={12}
                lg={12}
                md={12}
                sm={12}
                xs={12}
                className={classes.btn_save_product_container}
                display="flex"
                justifyContent="space-between"
              >
                <MyButton
                  label={btnProps.btnLabel}
                  size="small"
                  variant="outlined"
                  type="button"
                  className={
                    btnProps.btnLabel == "Add Product"
                      ? classes.btn_save
                      : classes.btn_update
                  }
                  style={{ width: "48%", height: "90%" }}
                  onClick={
                    btnProps.btnLabel == "Add Product"
                      ? saveProduct
                      : updateProduct
                  }
                />

                <MyButton
                  label="Clear Form"
                  size="small"
                  variant="outlined"
                  type="button"
                  className={classes.btn_clear}
                  style={{ width: "48%", height: "90%" }}
                  onClick={(e) => {
                    console.log("Clearing product form");
                    clearProductForm();
                  }}
                />
              </Grid>
            </Grid>

            {/* ----------- Image Upload Section ---------- */}

            <Grid
              container
              // rowGap={2}
              xl={6}
              lg={6}
              md={6}
              sm={12}
              xs={12}
              className={classes.product_main_container_right}
              // display="flex"
            >
              <Grid
                container
                // item
                xl={12}
                lg={12}
                md={12}
                sm={12}
                xs={12}
                mt={2}
                className={classes.image_upload_container}
                style={{
                  backgroundImage: `url${media}`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <img
                  src={media}
                  // alt={categoryName}
                  loading="lazy"
                  style={{
                    width: "100%",
                    height: "100%",
                  }}
                />
              </Grid>

              <Grid
                // container
                item
                xl={12}
                lg={12}
                md={12}
                sm={12}
                xs={12}
                mt={2}
                className={classes.btn_save_product_container}
              >
                {/* ---------- Upload Image button -------------- */}

                <Grid
                  item
                  xl={12}
                  lg={12}
                  md={12}
                  sm={12}
                  xs={12}
                  className={classes.btn_save_image_container}
                  display="flex"
                  // justifyContent="space-between"
                >
                  {/* <MyButton
                    label="Upload Image"
                    size="small"
                    variant="outlined"
                    type="button"
                    className={classes.btn_save}
                    style={{ width: "100%", height: "90%" }}
                    onClick={(e) => {
                      console.log("Image Uploaded");
                    }}
                  /> */}

                  <FileChooser
                    text="Upload Image"
                    multiple={false}
                    onUpload={(e) => {
                      // handleImageUpload(e);
                      handleMediaUpload(e);
                      setNewProductFormData({
                        ...newProductFormData,
                        product_image: e.target.files[0],
                      });
                      setMedia(e.target.files[0]);
                    }}
                    // displayFileName={true}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          {/* --------------------- Product Table---------------------- */}

          <Grid
            container
            xl={12}
            lg={12}
            md={12}
            sm={12}
            xs={12}
            className={classes.tbl_product_container}
            display="flex"
            // justifyContent="end"
          >
            <AdminTable
              // page="CR"
              tableColumns={tbl_product_columns}
              tableData={productData.map((product, index) => ({
                id: index,
                st_code: product.st_code,
                st_name: product.st_name,
                description: product.description,
                image_name: product.image_name,
                image_url: product.image_url,
                unit_price: product.unit_price,
                qty_on_hand: product.qty_on_hand,
                category_id: product.category_id,
              }))}
              // getRowId={(row) => row.reg_no}
              rowsPerPageOptions={5}
            />
          </Grid>
        </Grid>
      </Box>
      {/* ------------- Footer -------------- */}
      <Footer />

      <MySnackBar
        open={openAlert.open}
        alert={openAlert.alert}
        severity={openAlert.severity}
        variant={openAlert.variant}
        onClose={() => {
          setOpenAlert({ open: false });
        }}
      />
      <ConfirmDialog
        confirmDialog={confirmDialog}
        setConfirmDialog={setConfirmDialog}
      />
    </div>
  );
};

export default withStyles(styleSheet)(AdminPanel);
