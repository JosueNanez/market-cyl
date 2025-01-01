package com.bazar.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.bazar.entity.Producto;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, String>{
	
	List<Producto> findByAccrapido(int accrapido);
	
	Producto findByNomprod(String nomprod);
	
	@Query(value = "call consultarporproductomant(:nomprod)", nativeQuery = true)
	List<Producto> busquedaDinamicaProdMant(@Param("nomprod") String nomprod);
	
	@Query("SELECT p FROM Producto p JOIN p.detalleproducto dp WHERE dp.nomcateg = :nomcateg")
	List<Producto> findProductosByNomCateg(@Param("nomcateg") String nomcateg);
	


}
