const API_URL = 'http://localhost:3000/api/usuarios';
let dataTable;

$(document).ready(() => {
    dataTable = $('#usersTable').DataTable({
        ajax: {
            url: API_URL,
            dataSrc: '',
        },
        columns: [
            { data: 'id' },
            { data: 'nombre' },
            { data: 'email' },
            { data: 'direccion' },
            { data: 'telefono' },
            { data: 'genero' },
            { data: 'ocupacion' },
            {
                data: null,
                render: function (data, type, row) {
                    return `
                    <div class="row">
                        <div class="col-6">
                            <a data-toggle="tooltip" title="Editar usuario" class="btn mx-1 text-primary" onclick="editUser(${row.id})">
                                <i class="fas fa-edit"></i>
                            </a>
                        </div>
                        <div class="col-6">
                            <a data-toggle="tooltip" title="Eliminar usuario" class="btn mx-1 text-danger" onclick="deleteUser(${row.id})">
                                <i class="fas fa-trash-alt"></i>
                            </a>
                        </div>
                    </div>
                    `;
                }
            }            
        ],
        pageLength: 10,      // Fija la paginación en 10
        lengthChange: false, // Desactiva la opción "Show Entries",
        info: false,
        language: {
            search: "Buscar:",
            paginate: {
                previous: "Anterior",
                next: "Siguiente"
            }
        }
    });   
    
    $('#addUserBtn').click(function () {
        // Limpia el formulario
        $('#userId').val('');
        $('#userForm')[0].reset();
        $('#userModal .modal-title').text('Agregar Usuario'); // Cambia el título del modal
        $('#userModal').modal('show'); // Muestra el modal
    });
});

// Función para guardar usuario (crear o actualizar)
$('#userForm').submit(function (e) {
    e.preventDefault();

    const id = $('#userId').val();
    const nombre = $('#name').val().trim();
    const email = $('#email').val().trim();
    const direccion = $('#direccion').val().trim();
    const telefono = $('#telefono').val().trim();
    const genero = $('#genero').val();
    const ocupacion = $('#ocupacion').val().trim();

    // Validación de campos obligatorios
    if (!nombre || !email || !direccion || !telefono || !genero || !ocupacion) {
        Swal.fire('Error', 'Todos los campos son obligatorios.', 'error');
        return;
    }
    
    const data = {
        nombre: nombre,
        email: email,
        direccion: direccion,
        telefono: telefono,
        genero: genero,
        ocupacion: ocupacion
    };

    $.ajax({
        url: id ? `${API_URL}/${id}` : API_URL,
        method: id ? 'PUT' : 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function (result) {
            if (result.error) {
                Swal.fire('Error', result.error, 'error'); // Muestra mensaje si el correo ya existe
            } else {
                $('#userModal').modal('hide');
                dataTable.ajax.reload(); // Recarga los datos de la tabla
                const successMessage = id ? "Usuario actualizado correctamente" : "Usuario registrado correctamente";
                Swal.fire('Éxito', successMessage, 'success'); // Mensaje de éxito
            }
        },
        error: function (error) {
            console.error('Error al guardar usuario:', error);
            Swal.fire('Error', 'Error al guardar usuario', 'error');
        }
    });
});

// Función para cargar datos de usuario en el modal de edición
function editUser(id) {
    $.ajax({
        url: `${API_URL}/${id}`,
        method: 'GET',
        success: function (user) {
            $('#userId').val(user.id);
            $('#name').val(user.nombre);
            $('#email').val(user.email);
            $('#direccion').val(user.direccion || '');
            $('#telefono').val(user.telefono || '');
            $('#genero').val(user.genero || '');
            $('#ocupacion').val(user.ocupacion || '');
            $('#userModal').modal('show');
        },
        error: function (error) {
            console.error('Error al cargar datos del usuario:', error);
            alert('Error al cargar datos del usuario');
        }
    });
}

// Función para eliminar usuario
function deleteUser(id) {
    Swal.fire({
        title: "¿Estás seguro?",
        text: "¡No podrás recuperar este usuario después de eliminarlo!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Aceptar",
        cancelButtonText: "Cancelar"
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: `${API_URL}/${id}`,
                method: 'DELETE',
                success: function () {
                    dataTable.ajax.reload(); // Recarga los datos de la tabla
                    Swal.fire("Eliminado!", "Usuario eliminado correctamente.", "success");
                },
                error: function (error) {
                    console.error('Error al eliminar usuario:', error);
                    Swal.fire("Error", "No se pudo eliminar el usuario", "error");
                }
            });
        }
    });
}
