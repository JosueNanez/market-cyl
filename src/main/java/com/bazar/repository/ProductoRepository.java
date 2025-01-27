package com.bazar.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.bazar.entity.Producto;

import jakarta.transaction.Transactional;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, String>{
	
	List<Producto> findByAccrapido(int accrapido);
	
	Producto findByNomprod(String nomprod);
	
	@Query(value = "call consultarporproductomant(:nomprod)", nativeQuery = true)
	List<Producto> busquedaDinamicaProdMant(@Param("nomprod") String nomprod);
	
	@Query("SELECT p FROM Producto p JOIN p.detalleproducto dp WHERE dp.nomcateg = :nomcateg")
	List<Producto> findProductosByNomCateg(@Param("nomcateg") String nomcateg);
	
    @Modifying
    @Transactional
    @Query("UPDATE Producto p SET p.codpro = :nuevoCodpro WHERE p.codpro = :codproActual")
    int actualizarCodpro(String codproActual, String nuevoCodpro);
    
    
    
    
    
    // Método para eliminar registros de la tabla "producto"
    @Transactional
    @Modifying
    @Query("DELETE FROM Producto p WHERE p.nomprod = :nomprod")
    void eliminarProductosPorNombre(String nomprod);
    
    // Método para actualizar la tabla "detalleproducto" al eliminar en producto
    @Transactional
    @Modifying
    @Query("UPDATE DetalleProducto dp SET dp.stockactual = 0, dp.stockfaltanterepo = dp.stockminimo, dp.nomcateg = 'ELIMINADOS' WHERE dp.nomprod = :nomprod")
    void actualizarDetalleProductoPorNombre(String nomprod);

}
