let allInfoOne;

//-----------------------------------------
let allInfoTwo;

//----------------------------------------
let all_codeEFP_distinct = [];

let finallArray = [];
//-------------------------------------------------------
const fileOneError = {
  IsError: false,
  message: { type: "", size: "" },
};
const fileTwoError = {
  IsError: false,
  message: { type: "", size: "" },
};
let fileOneInfo = {
  size: 0,
  type: "",
  selectedFile: null,
  name: "",
  Isuploaded: false,
};
let fileTwoInfo = {
  size: 0,
  type: "",
  selectedFile: null,
  name: "",
  Isuploaded: false,
};

// const radioElement =  document.getElementsByClassName("type")
// for (let index = 0; index < radioElement.length; index++) {
//   const element = radioElement[index];
//   element.addEventListener("change",(e)=>{
//     if(e.target.checked){
//       console.log(e.target.value);
//       typeDis = e.target.value
//     }
//   })
// }

const messageOneElement = document.querySelector(
  ".custom-file-uploadOne #messageone"
);
const messageTwoElement = document.querySelector(
  ".custom-file-uploadTwo #messagetwo"
);
const fileOneElement = document.getElementById("fileOne");
const fileTwoElement = document.getElementById("fileTwo");

const fileOneBorder = document.querySelector(".custom-file-uploadOne");
const fileTwoBorder = document.querySelector(".custom-file-uploadTwo");

fileOneElement.addEventListener("change", (e) => {
  let filename = e.target.files[0].name;
  fileOneInfo.name = filename;
  fileOneInfo.size = e.target.files[0].size;
  fileOneInfo.Isuploaded = true;
  fileOneInfo.selectedFile = e.target.files[0];
  let spileFilearray = filename.split(".");
  fileOneInfo.type = spileFilearray[spileFilearray.length - 1];

  ControlleFileOneUpload();
});

fileTwoElement.addEventListener("change", (e) => {
  let filename = e.target.files[0].name;
  fileTwoInfo.name = filename;
  fileTwoInfo.size = e.target.files[0].size;
  fileTwoInfo.Isuploaded = true;
  fileTwoInfo.selectedFile = e.target.files[0];
  let spileFilearray = filename.split(".");
  fileTwoInfo.type = spileFilearray[spileFilearray.length - 1];

  ControlleFileTwoUpload();
});

function ControlleFileTwoUpload() {
  let filetype = fileTwoInfo.type;
  let fileSize = fileTwoInfo.size;
  if (filetype !== "xlsx" && filetype !== "xls") {
    fileTwoError.IsError = true;
    fileTwoError.message.type = "-Le type de fichier n'est pas pris en charge";
  } else {
    fileTwoError.message.type = "";
    if (fileSize > 5_000_000) {
      fileTwoError.IsError = true;
      fileTwoError.message.size =
        "-trop gros (Plus De 5Mb) pour être téléchargé";
    } else {
      fileTwoError.IsError = false;
    }
  }
  if (fileTwoError.IsError) {
    messageTwoElement.style.color = "red";
    messageTwoElement.innerHTML = Object.values(fileTwoError.message).join(
      "<br>"
    );
    fileTwoBorder.style.borderColor = "red";
  } else {
    messageTwoElement.innerHTML = "";
    fileTwoError.message.type = "";
    fileTwoError.message.size = "";
    fileTwoBorder.style.borderColor = "#009879";
    GetDataFileTwo();
  }
}

function ControlleFileOneUpload() {
  let filetype = fileOneInfo.type;
  let fileSize = fileOneInfo.size;
  if (filetype !== "xlsx" && filetype !== "xls") {
    fileOneError.IsError = true;
    fileOneError.message.type = "-Le type de fichier n'est pas pris en charge";
  } else {
    fileOneError.message.type = "";
    if (fileSize > 5_000_000) {
      fileOneError.IsError = true;
      fileOneError.message.size =
        "-trop gros (Plus De 5Mb) pour être téléchargé";
    } else {
      fileOneError.IsError = false;
    }
  }
  if (fileOneError.IsError) {
    messageOneElement.style.color = "red";
    messageOneElement.innerHTML = Object.values(fileOneError.message).join(
      "<br>"
    );
    fileOneBorder.style.borderColor = "red";
  } else {
    messageOneElement.innerHTML = "";
    fileOneError.message.type = "";
    fileOneError.message.size = "";
    fileOneBorder.style.borderColor = "#009879";
    GetDataFileOne();
  }
}

document.getElementById("valider-but").addEventListener("click", () => {
  let errorEle = document.getElementById("valid-error-message");
  let IsAllInfoUploaded = true;
  [fileOneInfo, fileTwoInfo].map((ele) => {
    if (ele.Isuploaded === false) {
      IsAllInfoUploaded = false;
    }
  });

  if (IsAllInfoUploaded) {
    let IsAllInfoUploadedValid = true;
    ControlleFileOneUpload();
    ControlleFileTwoUpload();
    [fileTwoError, fileTwoError].map((ele) => {
      if (ele.IsError === true) {
        IsAllInfoUploadedValid = false;
      }
    });
    if (IsAllInfoUploadedValid) {
      errorEle.innerHTML = "";
      //get data

      //get codeEFP distinct and for each codeEFP it's ville and complexe {codeEFP : ,info:{ville:,complexe:},filier:[]}
      Get_CodeEFP_distinct();
      // get foreach codeEFP filier distinct and for each filier it's code_filier, numGroup, year and Metiers {code_filier:,year:,numGroup:,metiers:[]}
      Get_for_each_CodeEFP_filier_distinct();
      Get_for_each_filier_Metiers_distinct_with_hour();
      OrganiseJsonObject();
      distinctFilier_Without_Year();
      exportFile();
      console.log(all_codeEFP_distinct);

      console.log(finallArray);
    } else {
      errorEle.innerHTML =
        "-veuillez télécharger les fichiers requis avec le bon type";
    }
  } else {
    errorEle.innerHTML = "-veuillez télécharger les fichiers requis";
  }
});

function GetDataFileOne() {
  let selectedFileOne = fileOneInfo.selectedFile;
  if (selectedFileOne) {
    let fileReader = new FileReader();
    fileReader.readAsBinaryString(selectedFileOne);
    fileReader.onload = (event) => {
      let data = event.target.result;
      let workbook = XLSX.read(data, { type: "binary" });
      //get All required data
      allInfoOne = XLSX.utils.sheet_to_row_object_array(
        workbook.Sheets[workbook.SheetNames[0]]
      );
    };
  }
}

function GetDataFileTwo() {
  let selectedFileTwo = fileTwoInfo.selectedFile;
  if (selectedFileTwo) {
    let fileReader = new FileReader();
    fileReader.readAsBinaryString(selectedFileTwo);
    fileReader.onload = (event) => {
      let data = event.target.result;
      let workbook = XLSX.read(data, { type: "binary" });
      //get All required data
      allInfoTwo = XLSX.utils.sheet_to_row_object_array(
        workbook.Sheets[workbook.SheetNames[0]]
      );
    };
  }
}

function Get_CodeEFP_distinct() {
  allInfoTwo.map((line) => {
    let EFP = line["EFP"];
    let found = false;
    let ville = line["Ville"];
    let Complexe = line["Complexe"];
    let codeEFP = line["CodeEFP"];
    all_codeEFP_distinct.map((ele) => {
      if (
        ele.codeEFP === codeEFP &&
        ele.info.ville === ville &&
        ele.info.complexe === Complexe
      ) {
        found = true;
      }
    });

    if (!found) {
      all_codeEFP_distinct.push({
        codeEFP: line["CodeEFP"],
        info: { ville: ville, complexe: Complexe, EFP: EFP },
        filiers: [],
      });
    }
  });
}

function Get_for_each_CodeEFP_filier_distinct() {
  all_codeEFP_distinct.map((ele1) => {
    allInfoTwo.map((line) => {
      let ville = line["Ville"];
      let Complexe = line["Complexe"];
      let codeEFP = line["CodeEFP"];
      if (
        ele1.codeEFP === codeEFP &&
        ele1.info.ville === ville &&
        ele1.info.complexe === Complexe
      ) {
        let exel_code_filier = line["Code filiére"];
        let year = line["Année de formation"];
        let numGroup = line[" Nbre Groupe 22-23 Réalisé"];
        let mode = line["MODE DE FORMATION"];
        let filier = line["Filière 22-23"];
        let secteur = line["Secteur"];
        let found = false;

        //see if filier already exists
        ele1.filiers.map((filier) => {
          if (filier.code_filier === exel_code_filier && filier.year === year) {
            found = true;
          }
        });

        //push new filier with its information if not exists
        if (!found) {
          ele1.filiers.push({
            code_filier: exel_code_filier,
            year: year,
            numGroup: numGroup,
            mode: mode,
            filier: filier,
            Metiers: [],
            secteur: secteur,
          });
        }
      }
    });
  });
}

function CalculateModeR(NMGroup, THP, THD, type_model) {
  if (type_model === "M") {
    return THD * Math.ceil(NMGroup / 2) + THP * NMGroup;
  } else {
    return (THD + THP) * NMGroup;
  }
}

function CalculateModeFPA(NMGroup, THP, THD, type_model) {
  if (type_model === "M") {
    return THD * Math.ceil(NMGroup / 2) + THP * (NMGroup / 2);
  } else {
    return (THD + THP) * NMGroup;
  }
}

function Get_for_each_filier_Metiers_distinct_with_hour() {
  all_codeEFP_distinct.map((ele) => {
    ele.filiers.map((filier) => {
      allInfoOne.map((line) => {
        if (
          (filier.code_filier === line["Code Filière Carte"] ||
            filier.code_filier === line["Code Filière DRIF"]) &&
          filier.year === line["Anneé de Formation"]
        ) {
          let mitier = line["Métier"];
          let type = line["type"];
          let creneau = line["Créneau"];
          let typeFor = line["Type de formation"];
          let niveauFor = line["Niveau de formation"];

          filier.code_filier_drif = line["Code Filière DRIF"];
          let THP1 =
            line["Somme de MH1AP"] === undefined ? 0 : line["Somme de MH1AP"];
          let THD1 =
            line["Somme de MH1AD"] === undefined ? 0 : line["Somme de MH1AD"];
          let THP2 =
            line["Somme de MH2AP"] === undefined ? 0 : line["Somme de MH2AP"];
          let THD2 =
            line["Somme de MH2AD"] === undefined ? 0 : line["Somme de MH2AD"];
          let THP3 =
            line["Somme de MH3AP"] === undefined ? 0 : line["Somme de MH3AP"];
          let THD3 =
            line["Somme de MH3AD"] === undefined ? 0 : line["Somme de MH3AD"];

          let totale1 =
            filier.mode === "R"
              ? CalculateModeR(filier.numGroup, THP1, THD1, type)
              : CalculateModeFPA(filier.numGroup, THP1, THD1, type);

          let totale2 =
            filier.mode === "R"
              ? CalculateModeR(filier.numGroup, THP2, THD2, type)
              : CalculateModeFPA(filier.numGroup, THP2, THD2, type);

          let totale3 =
            filier.mode === "R"
              ? CalculateModeR(filier.numGroup, THP3, THD3, type)
              : CalculateModeFPA(filier.numGroup, THP3, THD3, type);

          filier.Metiers.push({
            name: mitier && mitier.toUpperCase(),
            typeFor: typeFor,
            niveauFor: niveauFor,
            creneau: creneau,
            anne1: { THP: THP1, THD: THD1, totale: totale1 },
            anne2: { THP: THP2, THD: THD2, totale: totale2 },
            anne3: { THP: THP3, THD: THD3, totale: totale3 },
          });
        }
      });
    });
  });
}

function OrganiseJsonObject() {
  all_codeEFP_distinct.map((ele) => {
    //complex ville
    ele.filiers.map((filier) => {
      //filier
      filier.Metiers.map((metier) => {
        //metiar of filier
        let key =
          filier.year === 1 ? "anne1" : filier.year === 2 ? "anne2" : "anne3";

        metier[key] = {
          ...metier[key],
          numGroup: filier.numGroup,
          mode: filier.mode,
        };

        filier.typeFor = metier.typeFor;
        filier.creneau = metier.creneau;
        filier.niveauFor = metier.niveauFor;
      });
    });
  });
}

function distinctFilier_Without_Year() {
  all_codeEFP_distinct.map((EFP) => {
    //EFP Area
    let array1 = [];
    EFP.filiers.map((filierEle) => {
      let found1filier = false;
      let index1 = null;
      //filier area
      const {
        code_filier,
        typeFor,
        creneau,
        niveauFor,
        Metiers,
        year,
        code_filier_drif,
        filier,
        secteur,
      } = filierEle;

      array1.map((array1filier, index) => {
        //finding filier if already exist in distinct array
        if (array1filier.code_filier === code_filier) {
          found1filier = true;
          index1 = index;
        }
      });

      if (found1filier === true) {
        //if we found it we should add its Metiars to the existing and distinct métier
        filierEle.Metiers.map((metier1) => {
          //tring to find métier if already exists in distinct array
          const { name, anne1, anne2, anne3 } = metier1;
          let found2metier = false;
          let metierindex2 = null;
          array1[index1].Metiers.map((metier2, index2) => {
            if (name === metier2.name) {
              found2metier = true;
              metierindex2 = index2;
            }
          });

          if (found2metier) {
            //if meiter already exist we add its anne to existing métier

            array1[index1].Metiers[metierindex2]["anne" + year] =
              year === 1 ? anne1 : year === 2 ? anne2 : anne3;
          } else {
            //if not we push new object with old data
            array1[index1].Metiers.push({
              name: name,
              anne1: anne1,
              anne2: anne2,
              anne3: anne3,
            });
          }
        });
      } else {
        //if not we push new object with the old info
        array1.push({
          code_filier: code_filier,
          code_filier_drif: code_filier_drif,
          typeFor: typeFor,
          creneau: creneau,
          niveauFor: niveauFor,
          Metiers: Metiers,
          filier: filier,
          secteur: secteur,
        });
      }
    });
    EFP.filiers = array1;
  });
}

//////////////////////////////////////////////////////////////////////////////////////
function exportFile() {
  let allData = [];
  all_codeEFP_distinct.map((eleEFP) => {
    const { codeEFP, info } = eleEFP;

    eleEFP.filiers.map((filierEle) => {
      const {
        code_filier,
        typeFor,
        niveauFor,
        creneau,
        code_filier_drif,
        filier,
        secteur,
      } = filierEle;

      filierEle.Metiers.map((metier) => {
        const { anne1, anne2, anne3, name } = metier;
        // anne1: { THP: THP1, THD: THD1, totale: totale1 },
        allData.push({
          CLE: codeEFP + code_filier,
          CRENEAU: creneau,
          codeEFP: codeEFP,
          EFP: info.EFP,
          COMPLEXE: info.complexe,
          VILLE: info.ville,
          NIVEAU: niveauFor,
          TypeFormation: typeFor,
          "Code Filiér DRIF": code_filier_drif,
          "Code Filiér carte": code_filier,
          filiére: filier,
          secteur: secteur,
          Métier: name,
          MHD1A: anne1.THD,
          MHP1A: anne1.THP,

          MHD2A: anne2.THD,
          MHP2A: anne2.THP,

          MHD3A: anne3.THD,
          MHP3A: anne3.THP,

          "Mode 1A": anne1.mode === undefined ? 0 : anne1.mode,
          "Nbre Groupe 1A": anne1.numGroup === undefined ? 0 : anne1.numGroup,

          "Mode 2A": anne2.mode === undefined ? 0 : anne2.mode,
          "Nbre Groupe 2A": anne2.numGroup === undefined ? 0 : anne2.numGroup,

          "Mode 3A": anne3.mode === undefined ? 0 : anne3.mode,
          "Nbre Groupe 3A": anne3.numGroup === undefined ? 0 : anne3.numGroup,

          "MHT 1A": anne1.totale,
          "MHT 2A": anne2.totale,
          "MHT 3A": anne3.totale,
        });
      });
    });
  });
  console.log(allData);

  let filename = "exportedFile.xlsx";

  let ws = XLSX.utils.json_to_sheet(allData);
  let wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "sheet1");
  XLSX.writeFile(wb, filename);

  setTimeout(() => {
    location.reload();
  }, 2000);
}
