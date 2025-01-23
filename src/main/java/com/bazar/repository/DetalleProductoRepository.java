package com.bazar.repository;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.bazar.entity.DetalleProducto;

import jakarta.transaction.Transactional;

@Repository
public interface DetalleProductoRepository  extends JpaRepository<DetalleProducto, String>{
	
	List<DetalleProducto> findByNomcateg(String nomcateg);
	
	@Query(value = "call buscardetalleproductopornombre(:nomprod)", nativeQuery = true)
	List<DetalleProducto> busquedaDinamicaProd(@Param("nomprod") String nomprod);
	
	DetalleProducto findByNomprod(String nomprod);
	
	@Modifying
    @Transactional
    @Query("UPDATE DetalleProducto d SET d.preccompra = :preccompra, d.precventa = :precventa, d.ganancia = :precventa - :preccompra WHERE d.nomprod = :nomprod")
    int actualizarPreciosPorNombre(String nomprod, BigDecimal preccompra, BigDecimal precventa);
	
	@Modifying
    @Transactional
    @Query("UPDATE DetalleProducto dp SET dp.nomprod = :nuevoNomprod WHERE dp.nomprod = :antiguoNomprod")
    void actualizarNomprodEnDetalleProducto(String antiguoNomprod, String nuevoNomprod);

}
