class SharedUrl {
    //self hosted image url
    static IMGSOURCE = "http://localhost:8080/images/";

    //our store branding
    static SR_LOGO = this.IMGSOURCE + "brand/logo.png";
    static SR_BANNER = this.IMGSOURCE + "brand/banner.jpg";
    static SR_CHECKOUT_BANNER = this.IMGSOURCE + "brand/checkout_banner.jpg";


    //placeholders
    static P_BACKDROP_URL = "https://cdn.pixabay.com/photo/2015/11/06/15/04/bamboo-1028699_1280.jpg";
    static P_ICON_URL = "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.pngarts.com%2Ffiles%2F10%2FCircle-PNG-Transparent-Image.png&f=1&nofb=1&ipt=75453769b9e44f72b538b29c8eaddfd56aecf437a0e17737e515f35a8f1d44d5";

    //APi endpoint irls
    static API = "http://localhost:8080/api"
    static STORES = this.API + "/stores"
    static CATEGORIES = this.STORES + "/categories"
    static CART = this.API + "/cart"
}

export default SharedUrl;
