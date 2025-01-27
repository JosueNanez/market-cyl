package com.bazar.controller;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

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

import com.bazar.entity.Categoria;
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
	public String listaProductos(Model proveed, Model categ, @RequestParam(value = "selectedCateg", required = false) String selectedCateg) {
	    proveed.addAttribute("proveedores", servProveedor.listarProveedores());
	    categ.addAttribute("categorias", servCategoria.listarCategorias());
	    
	    if (selectedCateg != null) {
	    	categ.addAttribute("selectedCateg", selectedCateg);
	    	categ.addAttribute("mensajeExito", "Producto actualizado con éxito!");
	    }
		return "mantenimiento_producto_list";
	}
	
	//MANTENIMIENTO PRECIOS HTML
	@GetMapping("/listaPrecios")
	public String listaPrecios(Model proveed, Model categ) {
	    proveed.addAttribute("proveedores", servProveedor.listarProveedores());
	    
	    //Quitando registros con nombre "ELIMINADOS" del arreglo categoria
	    List<Categoria> categoriaFiltrada = servCategoria.listarCategorias();
	    categoriaFiltrada = categoriaFiltrada.stream()
	    	    .filter(categoria -> !categoria.getNomcateg().equals("ELIMINADOS"))
	    	    .collect(Collectors.toList());
	    
	    categ.addAttribute("categorias", categoriaFiltrada);
		return "mantenimiento_producto_precios";
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
		modelo.addAttribute("editable", false);
        proveed.addAttribute("proveedores", servProveedor.listarProveedores());
        categ.addAttribute("categorias", servCategoria.listarCategorias());
		return "mantenimiento_producto_editar";
	}
	
	@GetMapping("reactivar/{nom}") //Para reactivar productos eliminados
	public String mostrarReactivarEditarProd(@PathVariable String nom, Model modelo, Model proveed, Model categ) {
		
		DetalleProducto eliminadoDetalle = servicio.detalleProductoNombre(nom);
		eliminadoDetalle.setNomcateg("");

		Producto productorecuperable = new Producto();
		productorecuperable.setCodpro("000");
		productorecuperable.setFecvenc(null);
		productorecuperable.setStockcodigo(0);
		productorecuperable.setNomprod(nom);
		productorecuperable.setDetalleproducto(eliminadoDetalle);

		modelo.addAttribute("producto", productorecuperable);
		modelo.addAttribute("editable", true); // Indica que el campo CODIGO en HTML debe ser editable
		
        proveed.addAttribute("proveedores", servProveedor.listarProveedores());
        categ.addAttribute("categorias", servCategoria.listarCategorias());
		return "mantenimiento_producto_editar";
	}
	
	@PostMapping("editar/{cod}")
	public String actualizarProducto(@PathVariable String cod, @Valid Producto producto, BindingResult bindingResult, Model model, Model proveed, Model categ) {
		if (bindingResult.hasErrors()) {
			return "mantenimiento_producto_editar";
		}
		
		BigDecimal precompraprod = producto.getDetalleproducto().getPreccompra();
		BigDecimal precventaprod = producto.getDetalleproducto().getPrecventa();	
		

		ProductoDTO productoExistente = new ProductoDTO();
		productoExistente.setCodpro(producto.getCodpro());
		productoExistente.setFecvenc(producto.getFecvenc());
		productoExistente.setNomcateg(producto.getDetalleproducto().getNomcateg());
		productoExistente.setNomprod(producto.getNomprod());
		productoExistente.setNomprov(producto.getNomprov());
		// SI EL PRECIO DE COMPRA ES MAYOR AL DE VENTA
		// Usar compareTo para comparar BigDecimal: un valor positivo si el primero es mayor que el segundo.
		if (precompraprod.compareTo(precventaprod) > 0) {
			BigDecimal compra = null;
			compra = precventaprod.subtract(new BigDecimal("0.10"));
			productoExistente.setPreccompra(compra);
		} else {
			productoExistente.setPreccompra(precompraprod);
		}
		productoExistente.setPrecventa(producto.getDetalleproducto().getPrecventa());
		productoExistente.setStockcodigo(producto.getStockcodigo());
		productoExistente.setStockminimo(producto.getDetalleproducto().getStockminimo());
		
		servicio.registraActualizaProducto(productoExistente);
        proveed.addAttribute("proveedores", servProveedor.listarProveedores());
        categ.addAttribute("categorias", servCategoria.listarCategorias());
		model.addAttribute("mensajeExito", "Producto actualizado con éxito!");
		model.addAttribute("editable", false);
		return "redirect:/mantenimiento/producto/lista?selectedCateg=" + producto.getDetalleproducto().getNomcateg();
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
		detalleExistente.setStockfaltanterepo(minimo - actual);
		
		//Si el stockactual es 0 se envía a categoria "ELIMINADOS"
		if(detalleExistente.getStockactual() == 0) {
			detalleExistente.setNomcateg("ELIMINADOS");
		}
		
		//Actualizar la tabla DetalleProducto con objeto detalleExistente
		 //servicio.actualizarStockActual(nomProdElim, resta);
		 servicio.actualizarDetalleProducto(nomProdElim, detalleExistente);
		 
		modelo.addAttribute("categorias", servCategoria.listarCategorias()); 
		servicio.eliminarProductoPorCodigo(cod);
		modelo.addAttribute("mensajeExito", "Producto Eliminado");
		return "mantenimiento_producto_list";
	}
	
	
	//ELIMINAR PRODUCTO POR COMPLETO FISICO
	@GetMapping("/eliminarFisico/{nombre}")
	public String eliminarProducto(@PathVariable String nombre) {
		servicio.eliminarProducto(nombre);
		return "redirect:/mantenimiento/producto/lista";
	}
	
	/*
	@GetMapping("/eliminarFisicoAccRap/{nombre}")
	public String eliminarProductoAccRap(@PathVariable String nombre) {
		servicio.eliminarProducto(nombre);
		return "redirect:/mantenimiento/producto/listaPrecios";
	}*/
	
	//DESACTIVAR O ELIMINAR PRODUCTO QUE NO SE VENDE- ACCESO RAPIDO - PRECIOS
	@GetMapping("/eliminarAccRap")
    @ResponseBody
    public String eliminarProductoAR(@RequestParam() String nombre) {
        try {
        	//servicio.eliminarProducto(nombre);
        	servicio.eliminarProductoYActualizarDetalle(nombre);
        	
        	
        	System.out.println("producto Eliminado");
            return "Eliminado Definitivamente.";
        } catch (RuntimeException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
        }
    }
	
	
	
	
	
	
	
	//ENDPOINTS
	@GetMapping("/busquedaDinamica")
	@ResponseBody
	public List<Producto> obtenerSugerenciasMant(@RequestParam() String param) {
		return servicio.BusquedaDimanProductoMante(param);
	}
	
	@GetMapping("/prodporcategoriaMantePrecio")
	@ResponseBody
	public List<DetalleProducto> detalleporcategoriaMantePrecio(@RequestParam() String nomcateg){
		return servicio.listaProductosPorCategoria(nomcateg);
	}
	
	
	@GetMapping("/prodporcategoria")
	@ResponseBody
	public List<Producto> productosporCategoria(@RequestParam() String nomcateg){
		return servicio.obtenerProductosPorCategoria(nomcateg);
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
	
	@GetMapping("/actualizarCodigo")
    @ResponseBody
    public String actualizarCodigo(
    		@RequestParam() String codactual,
            @RequestParam() String nuevocodigo) {
        try {
        	servicio.actualizaCodpro(codactual, nuevocodigo);
        	System.out.println("codigo Actualizado");
            return "Codigo actualizado correctamente.";
        } catch (RuntimeException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
        }
    }
	
	@GetMapping("/actualizarNomProducto")
    @ResponseBody
    public String actualizarNombre(
    		@RequestParam() String antiguonomprod,
            @RequestParam() String nuevonomprod) {
        try {
        	servicio.actualizarNomprod(antiguonomprod, nuevonomprod);
        	System.out.println("Nombre Actualizado");
            return "Nombre actualizado correctamente.";
        } catch (RuntimeException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
        }
    }
	
	
	//Endpoints para formulario mantenimiento precios
	@GetMapping("/busquedaPrecios")
	@ResponseBody
	public List<DetalleProducto> obtenerSugerencias(@RequestParam() String param) {
		return servicio.SPBusquedaDimanProducto(param);
	}
	
	//LISTAR PRODUCTOS ELIMINADOS
	@GetMapping("/productosEliminados")
	@ResponseBody
	public List<DetalleProducto> listarProductosEliminados(){
		return servicio.listarProductosEliminados();
	}

}
