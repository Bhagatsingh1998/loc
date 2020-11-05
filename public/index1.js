console.log("index1.js");

const db = firebase.firestore();
const storageService = firebase.storage();

const introCarouselHTML = document.querySelector(".intro-carousel");

// const extractImgUrl = async (imgPath) => {
//   let imgUrl;
//   await storageService
//     .ref(imgPath)
//     .getDownloadURL()
//     .then((url) => {
//       imgUrl = url;
//     })
//     .catch((error) => {
//       console.log(error);
//     });
//   return imgUrl;
// };

db.collection("sliders").onSnapshot(async(snapshots) => {
  let snapshotDocs = snapshots.docs;
  let img = '';
  for(let doc of snapshotDocs) {
    let docData = doc.data();
    // console.log(docData);
    // let imgUrl = await extractImgUrl(`sliders/${doc.id}/${docData.img}`);
    img += `
    <a href="#">
      <div class="intro-content slide-one">
        <img class=""
          src="${docData.imgUrl}">
          <div class="container">
          <div class="row">
              <div class="col-lg-12">
                  <div class="slider-content">
                  </div>
              </div>
          </div>
      </div>
      </div>
    </a>`;
  };
  console.log(img);
  introCarouselHTML.innerHTML = img;
});


// src="https://i.pinimg.com/originals/ca/30/ac/ca30acfb5a052287f1b5861faafe9a15.jpg">