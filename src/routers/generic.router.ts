import { Router } from "express";


/**
 * Generic router class.
 *
 * @export
 * @abstract
 * @class GenericRouter
 */
export abstract class GenericRouter {

    /** The exported Express router. */
    public abstract router: Router;

    /**
     * Attaches handlers to router's endpoints.
     *
     * @abstract
     * @memberof GenericRouter
     */
    public abstract registerRoutes(): void;

}
