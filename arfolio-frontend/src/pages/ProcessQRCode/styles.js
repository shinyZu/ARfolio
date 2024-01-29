import qr_code from "../../assets/images/Portfolio/qr-code-with-barcode.png"

export const styleSheet = {
    box_container: {
        // border: "2px solid green",
        maxWidth: "1300px",
        margin: "auto auto 150px auto",
    },
    main_container: {
        // border: "2px solid red",
        marginTop: "5vh",
        // height: "70vh",
    },
    title_container: {
        // border: "2px solid blue",
    },
    txt_title: {
        color: "#6576bf !important",
        fontFamily: "Acme !important",
    },
    qr_container: {
        // border: "2px solid red",
        backgroundImage: `url(${qr_code})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "20vw",
        width: "20vw",
    },
    txt_qr_description: {
        color: "#ee5253 !important",
        fontFamily: "Acme !important",
        marginTop:"3vh !important",
        textAlign: "center",
    },
    btn_download: {
        border: "1px #273c75 !important",
        backgroundColor: "#273c75 !important",
        color: "white !important",
        fontFamily: '"Acme", sans-serif !important',
        marginTop: "10px",
        "&:hover": {
            cursor: "pointer",
            backgroundColor: "#192a56 !important",
        },
        padding: "10px 60px !important",
        boxShadow: "5px 5px 10px 2px rgb(7 12 8 / 50%) !important",
    },
    
};