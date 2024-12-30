package com.bazar.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Entity
@Table(name = "proveedor")
public class Proveedor {
	
	@Id
    @NotBlank (message = "El proveedor no puede estar vacío.")
    @Size(min = 2, max = 40, message = "El proveedor debe tener máximo 40 caracteres.")
	private String nomprov;
	
    @NotBlank (message = "El nombre no puede estar vacío.")
    @Size(min = 2, max = 40, message = "El nombre debe tener máximo 40 caracteres.")
	private String contprov;
	
    @NotBlank(message = "El teléfono no puede estar vacío.")
    @Pattern(regexp = "\\d{7,9}", message = "El teléfono debe tener entre 7 y 9 dígitos.")
	private String telprov;
}
