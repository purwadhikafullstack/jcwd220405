import { Button } from "@chakra-ui/react";
import "./NotFound.css";

export const NotFoundPage = () => {
  return (
    <div>
      <div className="container container-star">
        <div className="star-1"></div>
        <div className="star-1"></div>
        <div className="star-1"></div>
        <div className="star-1"></div>
        <div className="star-1"></div>
        <div className="star-1"></div>
        <div className="star-1"></div>
        <div className="star-1"></div>
        <div className="star-1"></div>
        <div className="star-1"></div>
        <div className="star-1"></div>
        <div className="star-1"></div>
        <div className="star-1"></div>
        <div className="star-1"></div>
        <div className="star-1"></div>
        <div className="star-1"></div>
        <div className="star-1"></div>
        <div className="star-1"></div>
        <div className="star-1"></div>
        <div className="star-1"></div>
        <div className="star-1"></div>
        <div className="star-1"></div>
        <div className="star-1"></div>
        <div className="star-1"></div>
        <div className="star-1"></div>
        <div className="star-1"></div>
        <div className="star-1"></div>
        <div className="star-1"></div>
        <div className="star-1"></div>
        <div className="star-1"></div>
        <div className="star-2"></div>
        <div className="star-2"></div>
        <div className="star-2"></div>
        <div className="star-2"></div>
        <div className="star-2"></div>
        <div className="star-2"></div>
        <div className="star-2"></div>
        <div className="star-2"></div>
        <div className="star-2"></div>
        <div className="star-2"></div>
        <div className="star-2"></div>
        <div className="star-2"></div>
        <div className="star-2"></div>
        <div className="star-2"></div>
        <div className="star-2"></div>
        <div className="star-2"></div>
        <div className="star-2"></div>
        <div className="star-2"></div>
        <div className="star-2"></div>
        <div className="star-2"></div>
        <div className="star-2"></div>
        <div className="star-2"></div>
        <div className="star-2"></div>
        <div className="star-2"></div>
        <div className="star-2"></div>
        <div className="star-2"></div>
        <div className="star-2"></div>
        <div className="star-2"></div>
        <div className="star-2"></div>
        <div className="star-2"></div>
      </div>
      <div className="container-title">
        <div className="title">
          <div className="number">4</div>
          <div className="moon">
            <div className="face">
              <div className="mouth"></div>
              <div className="eyes">
                <div className="eye-left"></div>
                <div className="eye-right"></div>
              </div>
            </div>
          </div>
          <div className="number">4</div>
        </div>
        <div className="subtitle">Oops. Looks like you took a wrong turn.</div>
        <Button
          variant="outline"
          mt="4"
          onClick={() => window.history.back()}
          _hover={{ color: "#292256", bgColor: "white" }}
        >
          Go back
        </Button>
      </div>
    </div>
  );
};
