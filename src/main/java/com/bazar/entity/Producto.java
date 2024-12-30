package com.bazar.entity;

import java.time.LocalDate;

import org.springframework.format.annotation.DateTimeFormat;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
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
@Table(name = "producto")
public class Producto {
	
	@Id
    @NotBlank (message = "El código no puede estar vacío.")
    @Size(min = 1, max = 25, message = "El código debe tener máximo 25 caracteres.")
    @Column(name = "codpro")
    private String codpro; 
     
    @NotBlank(message = "El nombre no puede estar vacío.")
    @Size(min = 2, max = 50, message = "El nombre debe tener máximo 50 caracteres.")
    @Column(name = "nomprod")
    private String nomprod; 
    
    @NotNull(message = "La fecha no puede estar vacía.")
    @Column(name = "fecvenc", nullable = false)
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDate fecvenc;
    
    @NotBlank (message = "El proveedor no puede estar vacío.")
    @Size(min = 2, max = 40, message = "El nombre debe tener máximo 40 caracteres.")
    @Column(name = "nomprov")
    private String nomprov; 
    
    @Column(name = "accrapido", length = 1)
    private int accrapido; // TINYINT(1)
    
    @Min(value = 1, message = "El stock por código no puede ser menor que 1.")
    @Max(value = 10000, message = "El stock por código no puede superar los 10000.")
    @NotNull(message = "El stock por código no puede estar vacío.")
    @Column(name = "stockcodigo")
    private float stockcodigo;
    
    @ManyToOne
    @JoinColumn(name = "nomprod", referencedColumnName = "nomprod", insertable = false, updatable = false)
    private DetalleProducto detalleproducto;

}
