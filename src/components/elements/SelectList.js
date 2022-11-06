import DropDownPicker from 'react-native-dropdown-picker';
import React, {useState} from "react";
import {useFocusEffect} from "@react-navigation/native";
import {useDispatch, useSelector} from "react-redux";
import {exportedProductCategoryStore} from "../redux/slices/productCategorySlice";
import {getAllProductCategories} from "../../dataAccesLayer/repositoryJCmendes/CategoriesRepo";

function getCategories() {

}

function SelectList() {
    // les hooks useDispatch() et useSelector() ne peut etre appélé que dans le corps d'un composant
    const dispatch = useDispatch(); // dispatch permet d'envoyer une action au store
    const categories = useSelector(exportedProductCategoryStore); // useSelector permet de récupérer le store

    useFocusEffect(         // useFocusEffect permet d'effectuer une action lorsque le composant est affiché
        React.useCallback(()=>{     // useCallback permet de créer une fonction qui reste en mémoire
            getAllProductCategories(dispatch) ; // on récupère les catégories (l'action est crée dans le repo)
            const itemArray = [];   // on crée un tableau qui va contenir les catégories
            categories.map((c) => { // on parcours le tableau des catégories
                const label = c.productCategoryName;    // on récupère le nom de la catégorie
                const value = c.productCategoryId;      // on récupère l'id de la catégorie
                itemArray.push({label: label, value: value}) // on ajoute le nom et l'id dans le tableau
            })
            setItems(itemArray);    // on met à jour le tableau des catégories dans le state local du composant
        }, [])  // on met un tableau vide pour que la fonction ne soit appelée qu'une seule fois
    )

    const [open, setOpen] = useState(false); // on crée un state local pour savoir si le menu est ouvert ou non
    const [value, setValue] = useState(null);// on crée un state local pour savoir quelle catégorie est sélectionnée
    const [items, setItems] = useState([]);  // on crée un state local pour stocker les catégories du menu

    return (
        <>
            <DropDownPicker open={open}         // open permet d'ouvrir ou de fermer la liste déroulante
                            value={value}       // value permet de récupérer la valeur sélectionnée
                            items={items}       // items permet de définir les éléments de la liste déroulante
                            setOpen={setOpen}   // setOpen permet de définir l'état de la liste déroulante
                            setValue={setValue} // setValue permet de définir la valeur sélectionnée
                            setItems={setItems} // setItems permet de définir les éléments de la liste déroulante
            />
        </>
    );
}
export default SelectList