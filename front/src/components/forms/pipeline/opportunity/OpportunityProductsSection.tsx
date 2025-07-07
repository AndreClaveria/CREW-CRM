// /components/forms/opportunities/OpportunityProductsSection.tsx
import React from "react";
import { opportunityFormStyles as styles } from "@/styles/components/forms/OpportunityFormStyles";
import { ProductFormData } from "@/hooks/useOpportunityForm";

interface OpportunityProductsSectionProps {
  products: ProductFormData[];
  addProduct: () => void;
  removeProduct: (index: number) => void;
  handleProductChange: (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
}

const OpportunityProductsSection: React.FC<OpportunityProductsSectionProps> = ({
  products,
  addProduct,
  removeProduct,
  handleProductChange,
}) => {
  // Calcul du total des produits
  const calculateTotal = () => {
    return products.reduce((total, product) => {
      return total + product.price * product.quantity;
    }, 0);
  };

  return (
    <div style={styles.sectionContainer}>
      <div style={styles.productListHeader}>
        <h3 style={styles.subSectionTitle}>Produits et services</h3>
        <button type="button" onClick={addProduct} style={styles.addButton}>
          Ajouter un produit
        </button>
      </div>

      {products.length === 0 ? (
        <div style={styles.emptyState}>
          <p>
            Aucun produit ajouté. Cliquez sur "Ajouter un produit" pour
            commencer.
          </p>
        </div>
      ) : (
        <>
          {products.map((product, index) => (
            <div key={index} style={styles.productCard}>
              <div style={styles.productCardHeader}>
                <h4 style={styles.productTitle}>Produit {index + 1}</h4>
                <button
                  type="button"
                  onClick={() => removeProduct(index)}
                  style={styles.removeButton}
                >
                  Supprimer
                </button>
              </div>

              <div style={styles.productFormGroup}>
                <label htmlFor={`product-${index}-name`} style={styles.label}>
                  Nom <span style={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  id={`product-${index}-name`}
                  name="name"
                  value={product.name}
                  onChange={(e) => handleProductChange(index, e)}
                  style={styles.input}
                  required
                  placeholder="Nom du produit ou service"
                />
              </div>

              <div style={styles.productRow}>
                <div style={styles.productFormGroup}>
                  <label
                    htmlFor={`product-${index}-price`}
                    style={styles.label}
                  >
                    Prix unitaire (€) <span style={styles.required}>*</span>
                  </label>
                  <input
                    type="number"
                    id={`product-${index}-price`}
                    name="price"
                    value={product.price}
                    onChange={(e) => handleProductChange(index, e)}
                    style={styles.input}
                    required
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                  />
                </div>

                <div style={styles.productFormGroup}>
                  <label
                    htmlFor={`product-${index}-quantity`}
                    style={styles.label}
                  >
                    Quantité <span style={styles.required}>*</span>
                  </label>
                  <input
                    type="number"
                    id={`product-${index}-quantity`}
                    name="quantity"
                    value={product.quantity}
                    onChange={(e) => handleProductChange(index, e)}
                    style={styles.input}
                    required
                    min="1"
                    step="1"
                    placeholder="1"
                  />
                </div>

                <div style={styles.productFormGroup}>
                  <label style={styles.label}>Total</label>
                  <div style={styles.productTotal}>
                    {new Intl.NumberFormat("fr-FR", {
                      style: "currency",
                      currency: "EUR",
                    }).format(product.price * product.quantity)}
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div style={styles.totalSection}>
            <div style={styles.totalLabel}>Total des produits :</div>
            <div style={styles.totalValue}>
              {new Intl.NumberFormat("fr-FR", {
                style: "currency",
                currency: "EUR",
              }).format(calculateTotal())}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default OpportunityProductsSection;
