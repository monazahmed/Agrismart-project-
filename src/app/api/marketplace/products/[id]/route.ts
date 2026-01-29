import { NextRequest, NextResponse } from 'next/server';
import { Product } from '@/models/product.model';
import { connectToDB } from '@/lib/mongoose/connect';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await connectToDB();

        const product = await Product.findById(params.id).lean();

        if (!product) {
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        return NextResponse.json(
            { error: 'Failed to fetch product' },
            { status: 500 }
        );
    }
}
