import { useEffect, useState } from "react";
import { getProducts, getCategories } from "../../services/api";

import CategoryBar from "./CategoryBar";
import ProductGrid from "./ProductGrid";

export default function Shop() {
  const [products, setProducts] = useState([]);        
  const [categories, setCategories] = useState([]);    
  const [activeCategory, setActiveCategory] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    const header = document.querySelector(".header");
    if (header) {
      setHeaderHeight(header.offsetHeight);
    }
  }, []);

  useEffect(() => {
    Promise.all([getProducts(), getCategories()])
      .then(([prods, cats]) => {
        const sortedCats = [...cats].sort((a, b) =>
          a.name.localeCompare(b.name, "es")
        );

        setProducts(prods);           
        setCategories(sortedCats);    

        if (sortedCats.length > 0) {
          setActiveCategory(sortedCats[0].slug);  
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading || activeCategory === null) {  
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p className="loading-text">Cargando tienda...</p>
      </div>
    );
  }

  const filteredProducts = products.filter(  
    (product) => product.category?.slug === activeCategory 
  );

  return (
    <>
      <div
        className="categories-fixed-wrapper"
        style={{ top: `${headerHeight}px` }}
      >
        <CategoryBar
          categories={categories}           
          activeCategory={activeCategory}   
          onSelect={setActiveCategory}      
        />
      </div>

      <div
        className="main-content"
        style={{
          paddingTop: `${headerHeight}px`
        }}
      >
        <ProductGrid products={filteredProducts} />  
      </div>
    </>
  );
}