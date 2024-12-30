package com.bazar.entity;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Entity
@Table(name = "detalleproducto")
public class DetalleProducto {
	
	@Id
    @NotBlank(message = "El nombre no puede estar vacío.")
    @Size(min = 2, max = 50, message = "El nombre debe tener máximo 50 caracteres.")
	@Column(name = "nomprod") 
    private String nomprod; 
    
    @DecimalMin(value = "0.00", inclusive = true, message = "El precio de compra no puede ser negativo.")
    @DecimalMax(value = "999.99", inclusive = true, message = "El precio de compra no puede exceder 999.99.")
    @Digits(integer = 5, fraction = 2, message = "El campo debe tener como máximo 5 dígitos y 2 decimales.")
    @NotNull(message = "El precio de compra no puede estar vacío.")
    @Column(name = "preccompra")
    private BigDecimal preccompra; 
    
    @DecimalMin(value = "0.00", inclusive = true, message = "El precio de venta no puede ser negativo.")
    @DecimalMax(value = "999.99", inclusive = true, message = "El precio de venta no puede exceder 999.99.")
    @Digits(integer = 5, fraction = 2, message = "El campo venta debe tener como máximo 5 dígitos y 2 decimales.")
    @NotNull (message = "El precio de venta no puede estar vacío.")
    @Column(name = "precventa")
    private BigDecimal precventa; 
    
    @Column(name = "ganancia")
    private BigDecimal ganancia;
    
    @NotBlank(message = "El nombre categoría no puede estar vacío.")
    @Size(min = 2, max = 30, message = "El nombre debe tener máximo 30 caracteres.")
    @Column(name = "nomcateg")
    private String nomcateg; 
    
    @Min(value = 1, message = "El stock mínimo no puede ser menor que 1.")
    @Max(value = 10000, message = "El stock mínimo no puede superar los 10000.")
    @NotNull(message = "El stock mínimo no puede estar vacío.")
    @Column(name = "stockminimo")
    private float stockminimo;
    
    @Column(name = "stockactual", nullable = false) 
    private float stockactual;
    
    @Column(name = "stockfaltanterepo")
    private float stockFaltanteRepo;

}
