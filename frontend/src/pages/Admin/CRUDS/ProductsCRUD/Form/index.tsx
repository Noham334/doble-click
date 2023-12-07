import { AxiosRequestConfig } from 'axios';
import { useEffect, useState } from 'react';
import CurrencyInput from 'react-currency-input-field';
import { Controller, useForm } from 'react-hook-form';
import { useHistory, useParams } from 'react-router-dom';
import Select from 'react-select';
import { Category } from 'types/category';
import { Product } from 'types/products';
import { requestBackend } from 'util/requests';
import { toast } from 'react-toastify';
import { ReactComponent as CancelUpImage } from '../../../../../assets/images/cancel-upload-icon.svg';
import './styles.css';

type UrlParams = {
  productId: string;
};

const Form = () => {
  const { productId } = useParams<UrlParams>();
  const isEditing = productId !== 'create';
  const history = useHistory();
  const [selectCategories, setSelectCategories] = useState<Category[]>([]);
  const [totalCategories, setTotalCategories] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control,
  } = useForm<Product>();

  useEffect(() => {
    const config: AxiosRequestConfig = {
      method: 'GET',
      url: '/categories',
      params: {
        size: totalCategories,
      },
    };

    requestBackend(config).then((response) => {
      setSelectCategories(response.data.content);
      setTotalCategories(response.data.totalElements);
    });
  }, [totalCategories]);

  useEffect(() => {
    if (isEditing) {
      requestBackend({ url: `/products/${productId}` }).then((response) => {
        const product = response.data as Product;

        setValue('name', product.name);
        setValue('price', product.price);
        setValue('description', product.description);
        setValue('imgUrl', product.imgUrl);
        setValue('categories', product.categories);
      });
    }
  }, [isEditing, productId, setValue]);

  const onSubmit = (formData: Product) => {
    const data = {
      ...formData,
      price: String(formData.price).replace(',', '.'),
    };

    const config: AxiosRequestConfig = {
      method: isEditing ? 'PUT' : 'POST',
      url: isEditing ? `/products/${productId}` : '/products',
      data,
      withCredentials: true,
    };

    requestBackend(config)
      .then(() => {
        toast.info('Producto Registrado con Éxito');
        history.push('/admin/products');
      })
      .catch(() => {
        toast.error('Error al Registrar Producto');
      });
  };

  const handleCancel = () => {
    history.push('/admin/products');
  };

  return (
    <div className="product-crud-container">
      <div className="base-card product-crud-form-card">
        <h1 className="product-crud-form-title">INFORMACION DEL PRODUCTO</h1>
        <form onSubmit={handleSubmit(onSubmit)} data-testid="form">
          <div className="row product-crud-inputs-container">
            <div className="col-lg-6 product-crud-inputs-left-container">
              <div className="margin-botton-30">
                <input
                  {...register('name', {
                    required: 'Campo Obligatório',
                  })}
                  type="text"
                  className={`form-control base-input ${
                    errors.name ? 'is-invalid' : ''
                  }`}
                  placeholder="Nombre del Producto"
                  name="name"
                  data-testid="name"
                />
                <div className="invalid-feedback d-block">
                  {errors.name?.message}
                </div>
              </div>

              <div className="margin-botton-30">
                <label htmlFor="categories" className="d-none">
                  Categorias
                </label>
                <Controller
                  name="categories"
                  rules={{ required: true }}
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={selectCategories}
                      classNamePrefix="product-crud-select"
                      isMulti
                      placeholder="Categorias"
                      getOptionLabel={(category: Category) => category.name}
                      getOptionValue={(category: Category) =>
                        String(category.id)
                      }
                      inputId="categories"
                    />
                  )}
                />
                {errors.categories && (
                  <div className="invalid-feedback d-block">
                    Campo Obligatorio
                  </div>
                )}
              </div>

              <div className="margin-botton-30">
                <Controller
                  name="price"
                  rules={{ required: 'Campo Obligatorio' }}
                  control={control}
                  render={({ field }) => (
                    <CurrencyInput
                      placeholder="Precio"
                      className={`form-control base-input ${
                        errors.name ? 'is-invalid' : ''
                      }`}
                      disableGroupSeparators={true}
                      value={field.value}
                      onValueChange={field.onChange}
                      data-testid="price"
                    />
                  )}
                />
                <div className="invalid-feedback d-block">
                  {errors.price?.message}
                </div>
              </div>

              {/*<div className="margin-botton-30">
                <input
                  {...register('imgUrl', {
                    required: 'Campo Obrigatório',
                    pattern: {
                      value: /^(https?|chrome):\/\/[^\s$.?#].[^\s]*$/gm,
                      message: 'Deve ser uma URL válida',
                    },
                  })}
                  type="text"
                  className={`form-control base-input ${
                    errors.name ? 'is-invalid' : ''
                  }`}
                  placeholder="URL da imagem do Produto"
                  name="imgUrl"
                  data-testid="imgUrl"
                />
                <div className="invalid-feedback d-block">
                  {errors.imgUrl?.message}
                </div>
              </div>*/}

              <div className="margin-botton-20 product-crud-button-add-image">
                <button className="btn btn-secondary text-white">
                  AGREGAR IMAGEM
                </button>
                <p>
                  La imagen debe ser un JGP o PNG y no debe sobrepasar los
                  <b> 5 mb.</b>
                </p>
              </div>
              <div className="product-crud-upload-image-card">
                <button className="product-crud-cancel-upload">
                  <CancelUpImage />
                </button>
                <div className="product-crud-bar-upload-image">
                  <div></div>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div>
                <textarea
                  rows={10}
                  {...register('description', {
                    required: 'Campo Obligatorio',
                  })}
                  className={`form-control base-input h-auto ${
                    errors.name ? 'is-invalid' : ''
                  }`}
                  placeholder="Descripción"
                  name="description"
                  data-testid="description"
                />
                <div className="invalid-feedback d-block">
                  {errors.price?.message}
                </div>
              </div>
            </div>
          </div>
          <div className="product-crud-buttons-container">
            <button className="btn btn-secondary product-crud-button text-white">
              GUARDAR
            </button>
            <button
              className="btn btn-outline-danger product-crud-button"
              onClick={handleCancel}
            >
              CANCELAR
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Form;
