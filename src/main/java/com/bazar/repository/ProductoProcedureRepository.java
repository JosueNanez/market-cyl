package com.bazar.repository;

import java.math.BigDecimal;
import java.time.LocalDate;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.bazar.entity.Producto;

@Repository
public interface ProductoProcedureRepository extends JpaRepository<Producto, String> {
	
	@Procedure(procedureName = "crearactualizarproducto")
	void crearActualizarProducto(
			@Param("pcodpro") String codpro,
			@Param("pnomprod") String nomprod,
			@Param("pfecvenc") LocalDate fecvenc,
			@Param("pnomprov") String nomprov,
			@Param("ppreccompra") BigDecimal preccompra,
			@Param("pprecventa") BigDecimal precventa,
			@Param("pnomcateg") String nomcateg,
			@Param("pstockminimo") float stockminimo,
			@Param("pstockcodigo") float stockcodigo
	);
	
	@Procedure(procedureName = "eliminarproducto")
	void eliminarProducto(@Param("pnomprod") String nomprod);

}
