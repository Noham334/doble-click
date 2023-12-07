import './styles.css';
import { Category } from 'types/category';
import { Link } from 'react-router-dom';
import { AxiosRequestConfig } from 'axios';
import { requestBackend } from 'util/requests';

type Props = {
  category: Category;
  onDelete: Function;
};

const CategoryCrudCard = ({ category, onDelete }: Props) => {
  const handleDelete = (categoryId: number) => {
    if (
      !window.confirm(
        'Esta seguro que desea eliminar esta categoria? Si existe un producto con esta categoria, deberias eliminarlo primero.'
      )
    ) {
      return;
    }

    const config: AxiosRequestConfig = {
      method: 'DELETE',
      url: `/categories/${categoryId}`,
      withCredentials: true,
    };

    requestBackend(config).then(() => {
      onDelete();
    });
  };

  return (
    <div className="base-card category-crud-card">
      <h6>{category.name}</h6>
      <div className="category-crud-card-buttons-container">
        <Link to={`/admin/categories/${category.id}`}>
          <button className="btn btn-outline-secondary category-crud-card-button">
            EDITAR
          </button>
        </Link>
        <button
          onClick={() => handleDelete(category.id)}
          className="btn btn-outline-danger category-crud-card-button"
        >
          ELIMINAR
        </button>
      </div>
    </div>
  );
};

export default CategoryCrudCard;
