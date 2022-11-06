/**
 * Répertoire des 'Strings' réccurents de l'app
 */

const strings = {
    //globales
    global:{
        appName: '',
        refreshRate: 10, // seconds
    },
    //pages todo: mettre a jour nom de pages
    tabs:{
        login: 'Login',
        orders: 'Gestion de commandes',
        product: 'Gestion de produits',
        openHours : 'Heures d\'ouvertures',
        processOrderTime: 'Temps de préparation',
        userRates: 'Recommendations',
        orderHistory: 'Historique de commandes',
        ordersSettings: 'Paramètres de commandes',
        productDetails: 'Details Produit',
        orderDetails : 'Details de la commande',
        categories: 'Gestion des catégories',
        userProfile : 'Profil',
        logout : 'se déconnecter',
        forgottenPassword : 'Envoie d\'un nouveau mot de passe',
        changePassword : 'Changer le mot de passe',
        shopRatings : 'Recommandations'
    },
    placeholderIMg: '',
    imageSize : {
      logo : {
        width : 100,
        height : 100,
      },
        detailProductMedium : {
            width : 250,
            height : 250,
        },
    },

    colors: {
        cyan : '#00CCBB',
    },

    errors:{
        required: 'Ce champ est obligatoire (3 caractères minimum).'
    }

}

export default strings