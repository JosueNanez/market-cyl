package com.bazar.entity;

import java.math.BigDecimal;
import java.time.LocalDate;

import org.springframework.format.annotation.DateTimeFormat;

import jakarta.persistence.Column;
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
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class ProductoDTO {
	
    @NotBlank(message = "El nombre no puede estar vacío.")
    @Size(min = 2, max = 50, message = "El nombre debe tener máximo 50 caracteres.")
    @Column(name = "nomprod")
	private String nomprod;
	
    @NotBlank (message = "El código no puede estar vacío.")
    @Size(min = 1, max = 25, message = "El código debe tener máximo 25 caracteres.")
    @Column(name = "codpro")
	private String codpro;

    @NotNull(message = "La fecha no puede estar vacía.")
    @Column(name = "fecvenc", nullable = false)
    @DateTimeFormat(pattern = "yyyy-MM-dd")
	private LocalDate fecvenc;
	
    @NotBlank (message = "El proveedor no puede estar vacío.")
    @Size(min = 2, max = 40, message = "El nombre debe tener máximo 40 caracteres.")
    @Column(name = "nomprov")
	private String nomprov;
	
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
	
    @NotBlank(message = "El nombre categoría no puede estar vacío.")
    @Size(min = 2, max = 30, message = "El nombre debe tener máximo 30 caracteres.")
    @Column(name = "nomcateg")
	private String nomcateg;
	
    @Min(value = 1, message = "El stock mínimo no puede ser menor que 1.")
    @Max(value = 10000, message = "El stock mínimo no puede superar los 10000.")
    @NotNull(message = "El stock mínimo no puede estar vacío.")
    @Column(name = "stockminimo")
    private float stockminimo;
	
    @Min(value = 1, message = "El stock por código no puede ser menor que 1.")
    @Max(value = 10000, message = "El stock por código no puede superar los 10000.")
    @NotNull(message = "El stock por código no puede estar vacío.")
    @Column(name = "stockcodigo")
    private float stockcodigo;
	
    @Column(name = "ganancia")
	private BigDecimal ganancia;
    
    //@Column(name = "stockactual")
	float stockactual;
    
    //@Column(name = "STOCK_REPONER")
	float stockfaltanterepo;
    

}
