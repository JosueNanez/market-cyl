package com.bazar.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
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
@Table(name = "categoria")
public class Categoria {
	
	@Id
	@NotBlank(message = "El nombre de Categoría no puede estar vacío.")
	@Size(min = 3, max = 30, message = "La categoría debe tener máximo 30 caracteres.")
	private String nomcateg;
	
	@NotBlank(message = "El nombre de la descripción no puede estar vacío.")
	@Size(min = 2, max = 55, message = "La descripción debe tener máximo 55 caracteres.")
	private String descate;

}
