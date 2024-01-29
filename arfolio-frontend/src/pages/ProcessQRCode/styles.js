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
    
};