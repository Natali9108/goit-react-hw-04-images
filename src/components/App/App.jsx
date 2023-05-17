import { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import * as ApiServise from '../../servises/Api';
import {
  BtnLoadMore,
  ImageGallery,
  Loader,
  Modal,
  Searchbar,
} from 'components';
import { useToggle } from 'hooks';
import { Container, MessageText } from './App.styled';

export const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showBtn, setShowBtn] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [error, setError] = useState(null);
  const [isEmpty, setIsEmpty] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const { isOpen, toggle } = useToggle();

  useEffect(() => {
    if (!searchQuery) {
      return;
    }
    setIsLoading(true);

    ApiServise.fetchImagesWithQuery(searchQuery, page)
      .then(({ hits, total }) => {
        if (!hits.length) {
          setIsEmpty(true);
        }

        setImages(state => [...state, ...hits]);
        setTotal(total);
        setShowBtn(page < Math.ceil(total / ApiServise.PER_PAGE));
      })
      .catch(error => setError(error.message))
      .finally(() => setIsLoading(false));
  }, [searchQuery, page]);

  const handleFormSubmit = searchQuery => {
    setSearchQuery(searchQuery);
    setPage(1);
    setImages([]);
    setIsLoading(false);
    setShowBtn(false);
    setError('');
    setActiveImage(0);
    setIsEmpty(false);
    setTotal(0);
  };

  const handleClickImage = image => {
    setActiveImage(image);

    toggle();
  };

  const handleLoadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  return (
    <Container>
      <Searchbar onSubmit={handleFormSubmit} images={images} />
      {!searchQuery && !images.length && (
        <MessageText>Please enter a value to search for images</MessageText>
      )}
      {error && <MessageText>{error.message}... 😭 </MessageText>}

      {isEmpty && (
        <MessageText>
          By request {searchQuery} no images were found... 😭
        </MessageText>
      )}

      {images.length > 0 && (
        <ImageGallery images={images} onClick={handleClickImage} />
      )}
      {isLoading && <Loader />}
      {showBtn && <BtnLoadMore onClick={handleLoadMore} />}
      {images.length > 0 && total === images.length && (
        <MessageText>
          We're sorry, but you've reached the end of search results.
        </MessageText>
      )}
      {isOpen && <Modal image={activeImage} onClose={toggle} />}

      <ToastContainer />
    </Container>
  );
};

// export class App extends Component {
//   state = {
//     searchQuery: '',
//     images: [],
//     isLoading: false,
//     showBtn: false,
//     error: '',
//     showModal: false,
//     page: 1,
//     total: 0,
//     activeImage: 0,
//     isEmpty: false,
//   };

//   async componentDidUpdate(__, prevState) {
//     const { page, searchQuery } = this.state;
//     const prevValue = prevState.searchQuery;
//     const nextValue = searchQuery;
//     const prevPage = prevState.page;
//     const nextPage = page;

//     if (prevValue !== nextValue || prevPage !== nextPage) {
//       this.setState({ isLoading: true });
//       ApiServise.fetchImagesWithQuery(nextValue, page)
//         .then(({ hits, total, totalHits }) => {
//           if (!hits.length) {
//             this.setState({ isEmpty: true });
//           }

//           this.setState(prevState => ({
//             images: [...prevState.images, ...hits],
//             total: total,
//             showBtn: page < Math.ceil(total / ApiServise.PER_PAGE),
//           }));
//         })
//         .catch(error => this.setState({ error }))
//         .finally(this.setState({ isLoading: false }));
//     }
//   }

//   handleFormSubmit = searchQuery => {
//     this.setState({
//       searchQuery: searchQuery,
//       page: 1,
//       images: [],
//       isLoading: false,
//       showBtn: false,
//       error: '',
//       showModal: false,
//       total: 0,
//       activeImage: 0,
//       isEmpty: false,
//     });
//   };

//   handleLoadMore = () => {
//     this.setState(({ page }) => ({ page: page + 1 }));
//   };

//   toggleModal = () => {
//     this.setState(({ showModal }) => ({ showModal: !showModal }));
//   };

//   handleClickImage = image => {
//     this.setState({ activeImage: image });
//     this.toggleModal();
//   };

//   render() {
//     const {
//       images,
//       error,
//       showBtn,
//       showModal,
//       searchQuery,
//       isLoading,
//       total,
//       activeImage,
//       isEmpty,
//     } = this.state;

//     return (
//       <Container>
//         <Searchbar getImageName={this.handleFormSubmit} images={images} />

//         {!searchQuery && !images.length && (
//           <MessageText>Please enter a value to search for images</MessageText>
//         )}

//         {error && <MessageText>{error.message}... 😭 </MessageText>}

//         {isEmpty && (
//           <MessageText>
//             By request {searchQuery} no images were found... 😭
//           </MessageText>
//         )}

//         {images.length > 0 && (
//           <ImageGallery images={images} onClick={this.handleClickImage} />
//         )}

//         {isLoading && <Loader />}

//         {showBtn && <BtnLoadMore onClick={this.handleLoadMore} />}

//         {images.length && total === images.length && (
//           <MessageText>
//             We're sorry, but you've reached the end of search results.
//           </MessageText>
//         )}

//         {showModal && <Modal image={activeImage} onClose={this.toggleModal} />}
//         <ToastContainer />
//       </Container>
//     );
//   }
// }
