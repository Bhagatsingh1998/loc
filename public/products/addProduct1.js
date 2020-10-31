console.log("AddProduct1.js");

const db = firebase.firestore();

const addProduct = document.querySelector("#add-product");
const productMainImgHandler = addProduct.querySelector("#product-main-image");
const productSubImgsHandler = addProduct.querySelector("#product-sub-imgs");
const productCategoryHTML = addProduct.querySelector("#product-category");
const productSubCategoryHTML = addProduct.querySelector(
  "#product-sub-category"
);
const productChildCategoryHTML = addProduct.querySelector(
  "#product-child-category"
);
const allAddonsHTML = addProduct.querySelector('#all-addons');

let mainImg, subImgs;
let allCategories, choosenCategory;

const displayCategories = (data) => {
  let options = '<option selected disabled value="">Select Category*</option>';
  data.map((doc) => {
    let docData = doc.data();
    // console.log(doc.id);
    options += `
    <option value="${doc.id}__${docData.name}">${docData.name}</option>
    `;
  });
  productCategoryHTML.innerHTML = options;
};

const extractCategories = async () => {
  let data;
  await db
    .collection("categories")
    .get()
    .then((snapshot) => {
      let snapshotDocs = snapshot.docs;
      data = snapshotDocs;
    })
    .catch((error) => {
      console.log(error);
    });

  return data;
};

extractCategories()
  .then((response) => {
    // console.log(response);
    allCategories = response;
    displayCategories(response);
  })
  .catch((error) => {
    console.log(error);
  });

const displaySubCategory = async (data, elHTML) => {
  // console.log(data);
  let docId = data.substring(0, 20);
  let docCat = data.substring(22);
  let options =
    '<option selected disabled value="">Select Sub Category*</option>';
  let dbRef = await db.collection("categories").doc(docId)

  dbRef.get().then((snapshot) => {
      // console.log(snapshot.data());
      let docData = snapshot.data();
      docData.subCategory.map((sc) => {
        // console.log(sc);
        options += `
        <option value="${docId}__${sc.id}__${sc.name}">${sc.name}</option>
        `;
      });
      // console.log(options);
      // console.log(elHTML);
      elHTML.innerHTML = options;
    })
    .catch((error) => {
      console.log(error);
    });
  
}

productCategoryHTML.addEventListener("change", (e) => {
  // console.log(e.target.value);
  choosenCategory = e.target.value;
  productSubCategoryHTML.disabled = false;
  displaySubCategory(e.target.value, productSubCategoryHTML);
});

const displayChildCategory = async(data, elHTML) => {
  let docId,scId;
  // console.log(data);
  docId = data.substring(0, 20);
  // console.log(docId);
  scId = data.substring(22, 41);
  // console.log(scId);

  let dbRef = await db.collection("categories").doc(docId)

  dbRef.get().then((snapshot) => {
      // console.log(snapshot.data());
      let docData = snapshot.data();
      let options = '<select id="product-child-category" disabled name="product-child-category">';
      docData.subCategory.map((sc) => {
        if(+sc.id === +scId) {
          // console.log(sc);
          sc.childCategories.map(cc => {
            // console.log(cc);
            options += `
            <option value="${docId}__${scId}__${cc.id}__${cc.name}">${cc.name}</option>
            `;
          })
          
        }
      });
      // console.log(options);
      // console.log(elHTML);
      elHTML.innerHTML = options;
    })
    .catch((error) => {
      console.log(error);
    });

}

productSubCategoryHTML.addEventListener("change", e => {
  choosenCategory = e.target.value;
  productChildCategoryHTML.disabled = false;
  displayChildCategory(e.target.value, productChildCategoryHTML);
});

const displayAddons = data => {
  let addon = '';
  // console.log(data);
  data.map(doc => {
    let docData = doc.data();
    // console.log(docData);
    addon += `
    <h5 class="addon"><input type="checkbox" name="product-addon" value="${doc.id}__${docData.name}" class="addon">&nbsp;${docData.name}</h5><br>
    `;
  });
  allAddonsHTML.innerHTML = addon;
}

const extractAddons = async () => {
  let addonsData;
  await db.collection('addons').get().then(snapshot => {
    let snapshotDocs = snapshot.docs;
    addonsData = snapshotDocs;
  })
  .catch(error => {
    console.log(error);
  });

  return addonsData;
};

extractAddons()
.then((response) => {
  // console.log(response);
  displayAddons(response);
})
.catch((error) => {
  console.log(error);
});

const addProductForm = (event) => {
  event.preventDefault();
  let productName,
    productSno,
    productCategory,
    productSubCategory,
    productChildCategory,
    productMRP,
    productSP,
    productGST,
    productTotalPrice,
    productDescription,
    productPolicy,
    productMainImg;

  let productTags = [];
  let productAddons = [];
  let productSubImgs = [];
  let cakeWeights = [];
  let cakeShapes = [];
  let cakeFlavours = [];
  let weightPrice, cakeType;

  productName = addProduct["product-name"].value;
  productSno = addProduct["product-sno"].value;
  productCategory = addProduct["product-category"].value;
  productSubCategory = addProduct["product-sub-category"].value;
  productChildCategory = addProduct["product-child-category"].value;
  console.log(productCategory);
  productMRP = addProduct["product-mrp"].value;
  productSP = addProduct["product-sp"].value;
  productGST = addProduct["product-gst"].value;
  productTotalPrice = addProduct["product-total-price"].value;

  addProduct
    .querySelectorAll('input[name="product-addon"]:checked')
    .forEach((addon) => {
      productAddons.push(addon.value);
    });

  addProduct.querySelectorAll('input[name="product-tag"]').forEach((tag) => {
    productTags.push(tag.value);
  });

  productDescription = $(".textarea1").summernote("code");
  productPolicy = $(".textarea2").summernote("code");

  if (productCategory.toUpperCase().includes('CAKE')) {
    addProduct
      .querySelectorAll('input[name="cake-weight"]')
      .forEach((weight) => {
        if (weight.checked) {
          if (weight.value == "half") {
            weightPrice = addProduct["cake-price-half"].value;
            console.log(weightPrice);
          } else if (weight.value === "one") {
            weightPrice = addProduct["cake-price-one"].value;
          } else if (weight.value === "oneHalf") {
            weightPrice = addProduct["cake-price-oneHalf"].value;
          } else if (weight.value === "two") {
            weightPrice = addProduct["cake-price-two"].value;
          } else if (weight.value === "three") {
            weightPrice = addProduct["cake-price-three"].value;
          } else if (weight.value === "four") {
            weightPrice = addProduct["cake-price-four"].value;
          } else if (weight.value === "five") {
            weightPrice = addProduct["cake-price-five"].value;
          } else {
            weightPrice = addProduct["cake-price-six"].value;
          }
          let data = {
            cakeWeight: weight.value,
            weightPrice: weightPrice,
          };

          cakeWeights.push(data);
        }
      });

    addProduct.querySelectorAll('input[name="cake-shape"]').forEach((shape) => {
      if (shape.checked) {
        if (shape.value === "Heart") {
          cakeShapes.push({
            shape: shape.value,
            shapePrice: addProduct["cake-price-heart"].value,
          });
        } else {
          cakeShapes.push({
            shape: shape.value,
            shapePrice: null,
          });
        }
      }
    });

    addProduct
      .querySelectorAll('input[name="cake-flavour"]:checked')
      .forEach((flavour) => {
        cakeFlavours.push(flavour.value);
      });

    if (addProduct.querySelector('input[name="cake-type"]:checked')) {
      cakeType = {
        type: "Eggless",
        price: addProduct["cake-price-eggless"].value,
      };
    }
  }

  if (mainImg) {
    productMainImg = `cake_${Math.random()}_${mainImg.name}`;
  } else {
    productMainImg = "";
  }
  if (subImgs) {
    productSubImgs = [...subImgs].map(
      (img) => `cake_${Math.random()}_${img.name}`
    );
  }

  let wholeProduct = {
    name: productName,
    sno: productSno,
    wholeCategory: productCategory,
    wholeSubCategory: productSubCategory,
    wholeChildCategory: productChildCategory,
    category: productCategory.substring(22),
    subCategory: productSubCategory.substring(43),
    childCategory: productChildCategory.substring(63),
    mrp: productMRP,
    sp: productSP,
    gst: productGST,
    totalPrice: productTotalPrice,
    tags: productTags,
    descriptions: productDescription,
    policy: productPolicy,
    mainImg: productMainImg,
    subImgs: productSubImgs,
    addons: productAddons,
    isActivated: true,
  };

  if (productCategory.toUpperCase().includes('CAKES')) {
    wholeProduct.weights = cakeWeights || '';
    wholeProduct.shapes = cakeShapes || '';
    wholeProduct.type = cakeType  || '';
    wholeProduct.flavours = cakeFlavours || '';
  }
  
  console.log(wholeProduct);
  let c = wholeProduct.wholeSubCategory.substring(43);
  // console.log(c);
  let cc = wholeProduct.wholeChildCategory.substring(63);
  // console.log(cc);

  async function addProductFun(data) {
    console.log(data);
    // console.log(data.category, typeof data.category);
    let dataId, prodData;
    await db
      .collection(data.category)
      .add(data)
      .then((dataSaved) => {
        // console.log(dataSaved.id);
        dataId = dataSaved.id;
      })
      .catch((error) => {
        console.log(error);
      });
    return { dataId: dataId, prodData: data };
  }

  addProductFun(wholeProduct)
    .then(async (response) => {
      // console.log(response);
      // console.log(response.prodData.category);
      // console.log(response.prodData.subImgs);
      // console.log(typeof response.prodData.subImgs);
      // console.log(typeof response.prodData.mainImg, response.prodData.mainImg);
      // console.log(response.dataId);
      // console.log(mainImg);

      const storageService = firebase.storage();
      if (mainImg) {
        await storageService
          .ref(
            `${response.prodData.category}/${response.dataId}/${response.prodData.mainImg}`
          )
          .put(mainImg);
      }
      // console.log(subImgs);

      async function uploadImg(id, name, img) {
        await storageService
          .ref(`${response.prodData.category}/${id}/${name}`)
          .put(img);
      }
      let counter = -1;

      async function upload() {
        for (let img of subImgs) {
          counter++;
          // console.log(img);
          let name = [...response.prodData.subImgs][counter];
          let id = response.dataId;
          await uploadImg(id, name, img);
        }
      }

      if (subImgs) {
        upload();
      }

      async function addingImgUrl(imgPath) {
        let imgUrl;
        // console.log(imgPath);
        await storageService
          .ref(imgPath)
          .getDownloadURL()
          .then((url) => {
            imgUrl = url;
          })
          .catch((err) => {
            imgUrl = err;
            // console.log(err);
          });

        console.log(imgUrl);
        return imgUrl;
      }

      addProduct.reset();
      addProduct.querySelector(".alert-success").textContent = "Product Saved";
      addProduct.querySelector(".alert-success").style.display = "block";
      setTimeout(() => {
        addProduct.querySelector(".alert-success").style.display = "none";
      }, 5000);
    })
    .catch((error) => {
      console.log(error);
      addProduct.querySelector(".alert-danger").innerHTML = error.message;
      addProduct.querySelector(".alert-danger").style.display = "block";
      setTimeout(() => {
        addProduct.querySelector(".alert-danger").style.display = "none";
      }, 5000);
    });
};

addProduct.addEventListener("submit", addProductForm);

const uploadMainImg = (e) => {
  mainImg = e.target.files[0];
  console.log(mainImg);
};
productMainImgHandler.addEventListener("change", uploadMainImg);

const uploadSubImgs = (e) => {
  subImgs = e.target.files;
  console.log(subImgs);
};
productSubImgsHandler.addEventListener("change", uploadSubImgs);

const calculate = (e) => {
  // console.log(e.target.value);
};

addProduct.querySelector("#product-mrp").addEventListener("keyup", calculate);
addProduct.querySelector("#product-sp").addEventListener("keyup", calculate);
addProduct.querySelector("#product-gst").addEventListener("keyup", calculate);

addProduct.addEventListener("keypress", function (event) {
  if (event.keyCode == 13) {
    event.preventDefault();
  }
});