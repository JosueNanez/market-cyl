package com.bazar.controller;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.server.ResponseStatusException;

import com.bazar.entity.DetalleProducto;
import com.bazar.entity.Producto;
import com.bazar.entity.ProductoDTO;
import com.bazar.service.CategoriaService;
import com.bazar.service.ProductoService;
import com.bazar.service.ProveedorService;

import jakarta.validation.Valid;

@Controller
@RequestMapping("/mantenimiento/producto/")
public class ProductoController {
	
	@Autowired
	private ProductoService servicio;
	
	@Autowired
	private ProveedorService servProveedor;
	
	@Autowired
	private CategoriaService servCategoria;
	
	
	//CONSULTA HTML
	@GetMapping("/lista")
	public String listaProductos(Model proveed, Model categ) {
	    proveed.addAttribute("proveedores", servProveedor.listarProveedores());
	    categ.addAttribute("categorias", servCategoria.listarCategorias());
		return "mantenimiento_producto_list";
	}
	
	
	//REGISTRAR
	@GetMapping("/registro")
	public String mostrarMantenimientoProducto(Model modelo, Model proveed, Model categ) { //
		ProductoDTO producto = new ProductoDTO();
	    modelo.addAttribute("producto", producto);
	    proveed.addAttribute("proveedores", servProveedor.listarProveedores());
	    categ.addAttribute("categorias", servCategoria.listarCategorias());
		return "mantenimiento_producto";
	}
	@PostMapping("/registro")
	public String guardarProducto(@Valid @ModelAttribute("producto") ProductoDTO producto, BindingResult bindingResult, Model model, Model proveed, Model categ) {
	    if (bindingResult.hasErrors()) {
	        proveed.addAttribute("proveedores", servProveedor.listarProveedores());
	        categ.addAttribute("categorias", servCategoria.listarCategorias());
	        return "mantenimiento_producto";
	    }

	    servicio.registraActualizaProducto(producto);
	    model.addAttribute("mensaje", "Producto registrado con éxito!");

	    // Recarga el formulario con un nuevo objeto vacío
	    ProductoDTO nuevoProducto = new ProductoDTO();
	    model.addAttribute("producto", nuevoProducto);

	    proveed.addAttribute("proveedores", servProveedor.listarProveedores());
	    categ.addAttribute("categorias", servCategoria.listarCategorias());
	    return "mantenimiento_producto";
	}
	
	//ACTUALIZAR
	@GetMapping("editar/{cod}")
	public String mostrarMantenimentoEditarProd(@PathVariable String cod, Model modelo, Model proveed, Model categ) {
		modelo.addAttribute("producto", servicio.productoPorCodigo(cod));
        proveed.addAttribute("proveedores", servProveedor.listarProveedores());
        categ.addAttribute("categorias", servCategoria.listarCategorias());
		return "mantenimiento_producto_editar";
	}
	
	@PostMapping("editar/{cod}")
	public String actualizarProducto(@PathVariable String cod, @Valid Producto producto, BindingResult bindingResult, Model model, Model proveed, Model categ) {
		if (bindingResult.hasErrors()) {
			return "mantenimiento_producto_editar";
		}
		
		ProductoDTO productoExistente = new ProductoDTO();
		productoExistente.setCodpro(producto.getCodpro());
		productoExistente.setFecvenc(producto.getFecvenc());
		productoExistente.setNomcateg(producto.getDetalleproducto().getNomcateg());
		productoExistente.setNomprod(producto.getNomprod());
		productoExistente.setNomprov(producto.getNomprov());
		productoExistente.setPreccompra(producto.getDetalleproducto().getPreccompra());
		productoExistente.setPrecventa(producto.getDetalleproducto().getPrecventa());
		productoExistente.setStockcodigo(producto.getStockcodigo());
		productoExistente.setStockminimo(producto.getDetalleproducto().getStockminimo());
		
		servicio.registraActualizaProducto(productoExistente);
        proveed.addAttribute("proveedores", servProveedor.listarProveedores());
        categ.addAttribute("categorias", servCategoria.listarCategorias());
		model.addAttribute("mensajeExito", "Producto actualizado con éxito!");
		return "mantenimiento_producto_editar";
	}
	
	//ELIMINAR PRODUCTO POR CÓDGIO
	@GetMapping("/eliminar/{cod}")
	public String eliminarPorCodigo(@PathVariable String cod, Model modelo) {
		//Obtener el stock del producto por cod a eliminar y guardar en stockCodElim
		Producto productoElim = servicio.productoPorCodigo(cod);
		float stockCodElim = productoElim.getStockcodigo();
		String nomProdElim = productoElim.getNomprod();
		System.out.println("Obtuvo el stock del productoElim");
		
		//Obtener el producto a eliminar en tabla DetalleProducto
		DetalleProducto detalleExistente = servicio.detalleProductoNombre(nomProdElim);
		float resta = detalleExistente.getStockactual() - stockCodElim;
		detalleExistente.setStockactual(resta);
		
		// StockRepo = Stock Min - Stock Actual
		float minimo = detalleExistente.getStockminimo();
		float actual = detalleExistente.getStockactual();
		detalleExistente.setStockFaltanteRepo(minimo - actual);
		
		//Actualizar la tabla DetalleProducto con objeto detalleExistente
		 //servicio.actualizarStockActual(nomProdElim, resta);
		 servicio.actualizarDetalleProducto(nomProdElim, detalleExistente);
		 
		 
		servicio.eliminarProductoPorCodigo(cod);
		modelo.addAttribute("mensajeExito", "Producto Eliminado");
		return "mantenimiento_producto_list";
	}
	
	
	//ELIMINAR PRODUCTO POR COMPLETO
	@GetMapping("/eliminarFisico/{nombre}")
	public String eliminarProducto(@PathVariable String nombre) {
		servicio.eliminarProducto(nombre);
		return "redirect:/mantenimiento/producto/lista";
	}
	
	
	
	
	
	
	
	
	
	//ENDPOINTS
	@GetMapping("/busquedaDinamica")
	@ResponseBody
	public List<Producto> obtenerSugerenciasMant(@RequestParam() String param) {
		return servicio.BusquedaDimanProductoMante(param);
	}
	
	@GetMapping("/ProductoPorCodigo") 
	@ResponseBody
	public Producto obtenerporCodigo(@RequestParam() String codigo) {
		Producto producto = servicio.productoPorCodigo(codigo);
		if (producto == null) {
			throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Producto no registrado"); 
		}
		return producto;
	}
	
	
	//ACCESOS DIRECTOS
	/*@GetMapping("/updateAcceso")
	@ResponseBody
	public Producto actualizarAcceso(@RequestParam() String nomProd, @RequestParam() int acceso) {
		return servicioProducto.actualizarAccRapido(nomProd, acceso);
	}*/
	
	@GetMapping("/actualizarPrecios")
    @ResponseBody
    public String actualizarPrecios(
    		@RequestParam() String nomprod,
            @RequestParam() BigDecimal preccompra,
            @RequestParam() BigDecimal precventa) {
        try {
        	servicio.actualizarPrecios(nomprod, preccompra, precventa);
        	System.out.println("producto Actualizado");
            return "Precios actualizados correctamente.";
        } catch (RuntimeException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
        }
    }
	
	
	

}